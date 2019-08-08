module.exports = () => {
  return {
    single(){
      return (req, res, next) => {
        req.file = 'http://testimageurl'
        next()
      }
    },
    array () {

    },
    none () {

    }
  }
}