const newPointer = str => {
  const encoder = new TextEncoder()

  // console.log(encoder.encode(str))

  const stream = new Uint8Array([
    ...encoder.encode(str)
  , 0
  ])
  return Deno.UnsafePointer.of(stream)
}

const p2Str = ptr => {
  return new Deno.UnsafePointerView(ptr)
  .getCString()
}

export {
  newPointer
, p2Str
}
