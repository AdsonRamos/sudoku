const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const clone = (object) => {
  return JSON.parse(JSON.stringify(object))
}

export {
  sleep,
  clone
}