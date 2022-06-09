import { path } from './deps.js'
import { newPointer, p2Str } from './pointer.js'

const libFilePath =
  path.join(
    Deno.cwd()
  , './lib/libfdb_c.x86_64.so'
  )

console.log(libFilePath)

const funcMap = {

  fdb_get_max_api_version: {
    parameters: []
  , result: 'isize'
  }

, fdb_select_api_version_impl: {
    parameters: [
      'isize' // runtime_version
    , 'isize' // header_version
    ]
  , result: 'isize' // fdb_error_t
  }

, fdb_create_database: {
    parameters: [
      'pointer' // cluster_file_path
    , 'pointer' // out_database
    ]
  , result: 'isize' // fdb_error_t
  }

, fdb_database_destroy: {
    parameters: [
      'pointer' //database
    ]
  , result: 'void'
  }

, fdb_get_error: {
    parameters: [
      'isize' // code
    ]
  , result: 'pointer' // char*
  }

, fdb_setup_network: {
    parameters: []
  , result: 'isize' // fdb_error_t
  }

, fdb_run_network: {
    parameters: []
  , result: 'isize' // fdb_error_t
  }

, fdb_stop_network: {
    parameters: []
  , result: 'isize' // fdb_error_t
  }

, fdb_database_create_transaction: {
    parameters: [
      'pointer' // database
    , 'pointer' // out_transaction
    ]
  , result: 'isize' // fdb_error_t
  }
, fdb_transaction_get_read_version: {
    parameters: [
      'pointer' // transaction
    ]
  , result: 'isize'
  }

// fdb_database_create_transaction
// fdb_transaction_get
// fdb_future_block_until_ready
// fdb_future_get_error
// fdb_future_get_value
// fdb_future_destroy
// fdb_transaction_destroy

}

const dylib = Deno.dlopen(libFilePath, funcMap).symbols

const FDB_API_VERSION = dylib.fdb_get_max_api_version()
console.log('FDB_API_VERSION:', FDB_API_VERSION)

const chk = eCode => {
  console.log("err")
  if (eCode) {
    console.log(1)
    const err = p2Str(dylib.fdb_get_error(eCode))
    console.log({err})
  }
  else {
    console.log(2)
    console.log({err: eCode})
  }
}

const nChks = {
  setup_network: dylib.fdb_setup_network
, run_network: dylib.fdb_run_network
, stop_network: dylib.fdb_stop_network

, select_api_version: dylib.fdb_select_api_version_impl
, create_database: dylib.fdb_create_database
// , database_destroy: dylib.fdb_database_destroy

, database_create_transaction: dylib.fdb_database_create_transaction
, transaction_get_read_version: dylib.fdb_transaction_get_read_version
}

const chks =
  Object.keys(nChks)
  .reduce(
    (r, c) => ({
      ...r
    , [c]: (...args) => {
        console.log(`[fdb]: ${c}`)
        console.log(args)
        chk(nChks[c].apply(null, args))
      }
    })
  , {}
  )

chks.select_api_version(710, FDB_API_VERSION)

const clusterPath = './fdb.cluster'
const p2clusterPath = newPointer(clusterPath)

console.log(p2Str(p2clusterPath))

// const LITTLE_ENDIAN =
//   new Uint8Array(
//     new Uint32Array([0x12345678]).buffer
//   )[0] === 0x78

// const outDB = new Uint8Array(8)
// const outDV = new DataView(outDB.buffer)
// const handleDB = new Deno.UnsafePointer(
//   outDV.getBigUint64(0, LITTLE_ENDIAN)
// )

chks.setup_network()
// chks.run_network()

const outDB = new BigUint64Array(1)
const handleDB = new Deno.UnsafePointer(outDB[0])

chks.create_database(p2clusterPath, outDB)

const outTransaction = new BigUint64Array(1)
const handleTransaction = new Deno.UnsafePointer(outTransaction[0])

chks.database_create_transaction(handleDB, outTransaction)

chks.transaction_get_read_version(handleTransaction)

// dylib.fdb_database_destroy(handleDB)

// chks.stop_network()
