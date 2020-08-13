
/** @args {object} keys to use in the state */
export default function init({
  loading = '_loading', error = '_error', force = '_force'
} = {}) {
  async function main( state, fn ) {
    state[loading] = true
    state[error] = null
    try {
      return await fn()
    } catch (e) {
      state[loading] = false
      state[error] = e.message
      console.error(e)
    }
  }

  main.defaults = function(names) {
    function newDefault() {
      return {
        [loading]: null,
        [error]: null
      }
    }

    if(!names) {
      return newDefault()
    }

    const defaults = {}
    names.forEach(name => { defaults[name] = newDefault() })
    return defaults
  }

  main.singleton = function(state, fn) {
    const forceValue = state[force]
    if( !forceValue && state[loading] !== null ) {
      return
    }

    if(forceValue) {
      state[force] = false
    }

    return main(state, fn)
  }

  main.done = function(state) {
    state[loading] = false
  }

  main.resetError = function(state) {
    state[error] = null
  }

  return main
}
