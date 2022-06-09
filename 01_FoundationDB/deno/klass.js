const newFunctor = () => {

  const Functor = () => {
    const data = {
      result: null
    }

    return {
      getData: () => data.result
    , setData: newValue => data.result = newValue
    }
  }

  return Functor()

}

const fun1 = newFunctor()
fun1.setData(1)

const fun2 = newFunctor()
fun2.setData(2)

console.log(
  fun1.getData()
)
console.log(
  fun2.getData()
)

fun1.setData(99)
fun2.setData(98)

console.log(
  fun1.getData()
)
console.log(
  fun2.getData()
)
