/* 

const share = { 
  title: "", 
  text: "", 
  url: ""
}
*/

function share(shareObject) {
  if (!('share' in navigator)) {
    alert('Web Share API not supported.')
    return
  }
  navigator
    .share(shareObject)
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing:', error))
}

export default share
