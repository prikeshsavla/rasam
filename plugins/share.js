function share(shareObject) {
  if (!('share' in navigator)) {
    alert('Web Share API not supported.')
    return
  }

  /*
{
        title: 'What Web Can Do Today',
        text: 'Can I rely on the Web Platform features to build my app? An overview of the device integration HTML5 APIs',
        url: 'https://whatwebcando.today/'
      }
    */

  navigator
    .share(shareObject)
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing:', error))
}

export default share
