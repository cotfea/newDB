#include <iostream>
#include <thread>
#include <condition_variable>
#include <mutex>
#include <chrono>
#define FDB_API_VERSION 710
#include </fdb_c.h>

using namespace std;

void check(fdb_error_t code, int line) {
  if (code) {
    cerr  << "error: " << fdb_get_error(code) << " [" << code << "]"
          << " at line " << line << endl;
    std::exit(1);
  }
}

#define CHECK(err) check(err, __LINE__)

void read(FDBDatabase* db) {
  FDBTransaction* tr;
  CHECK(fdb_database_create_transaction(db, &tr));

  auto* fut = fdb_transaction_get(tr, (const uint8_t*)"a", 1, true);
  CHECK(fdb_future_block_until_ready(fut));

  CHECK(fdb_future_get_error(fut));

  const uint8_t *value;
  int length;
  fdb_bool_t value_present;
  CHECK(fdb_future_get_value(fut, &value_present, &value, &length));

  if (!value_present) {
    cout << "key not present" << endl;
  } else {
    cout  << "key value [" << length << "]: "
          << string((const char*)value, length) << endl;
  }

  fdb_future_destroy(fut);
  fdb_transaction_destroy(tr);
}

thread start(bool addCompletionHook, int attempt) {
  std::condition_variable cond;
  std::mutex mu;
  bool ready{false};

  thread netw([&, attempt]() mutable {
    cout << "network{" << attempt << "} going up\n";
    {
      std::lock_guard<std::mutex> lock(mu);
      ready = true;
    }
    cond.notify_one();
    CHECK(fdb_run_network());
    cout << "network{" << attempt <<"} thread done\n";
  });

  if (addCompletionHook) {
    CHECK(fdb_add_network_thread_completion_hook([](void*){
      cout << "network done\n";
    }, nullptr));
  }

  std::unique_lock<std::mutex> lock(mu);
  cond.wait(lock, [&]() { return ready; });

  this_thread::sleep_for(chrono::milliseconds(100));

  return netw;
}

int main() {
  CHECK(fdb_select_api_version(620));
  CHECK(fdb_setup_network());
  int attempt{0};

  for (int i = 0; i < 1; i++) {
    auto netw = start(true, ++attempt);

    cout << "network{" << attempt << "} going down\n";
    CHECK(fdb_stop_network());
    netw.join();
  }

  auto netw = start(false, ++attempt);
  // netw = start(false, ++attempt);
  // netw = start(false, ++attempt);
  // netw = start(false, ++attempt);

  FDBDatabase* db;
  CHECK(fdb_create_database("", &db));

  cout << "making a call\n";
  read(db);

  fdb_database_destroy(db);

  cout << "network going down\n";
  CHECK(fdb_stop_network());
  netw.join();
}
