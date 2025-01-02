function typeOf(data) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
}
// 定义一个按照指定要求创建节点的函数
function createElement(tag, attrs, children) {
  if (typeof tag !== 'string') throw new Error('tag参数类型必须是字符串')
  let element = document.createElement(tag)
  if (element instanceof HTMLUnknownElement) throw new Error('tag标签名不合法')
  attrs = typeOf(attrs === 'object') ? attrs : {}
  Object.entries(attrs).forEach(attr => {
    let attrName = attr[0]
    let attrValue = typeOf(attr[1]) === 'object' ? Object.entries(attr[1]).join(';').split(',').join(':') : attr[1]
    element[attrName] = attrValue
  })
  if (typeof children === 'string') element.innerHTML = children
  return element
}
function initScroll(element) {
  let navBg = document.querySelector('.nav-bg')
  let songController = document.querySelector('.song-controller')

  let cover = document.querySelector('.cover')
  let coverBg = cover.firstElementChild
  let initControllerTonavBgDistance = cover.getBoundingClientRect().height - songController.getBoundingClientRect().height - navBg.getBoundingClientRect().height
  element.addEventListener('touchstart', event => {
    function eleMove(e) {
      let controllerTonavBgDistance = songController.getBoundingClientRect().top - navBg.getBoundingClientRect().height
      let navBgOpacityValue = 1 - controllerTonavBgDistance / initControllerTonavBgDistance
      if (navBgOpacityValue > 1) navBgOpacityValue = 1
      if (navBgOpacityValue < 0) navBgOpacityValue = 0
      navBg.style.opacity = navBgOpacityValue
      cover.style.transition = 'unset'
      coverBg.style.transition = 'unset'
      let HeightValue = e.touches[0].clientY - event.touches[0].clientY
      if (HeightValue > 70) HeightValue = 70
      if (HeightValue < 0) HeightValue = 0
      cover.style.height = (375 + HeightValue) / 3.75 + 'vw'
      coverBg.style.backgroundSize = (100 + HeightValue) + '%'
      if (element.getBoundingClientRect().top - navBg.getBoundingClientRect().height - songController.getBoundingClientRect().height < 0) {
        document.querySelector('.song').style.transform = 'none'
        songController.style.cssText = `position:fixed;top:${(navBg.getBoundingClientRect().height)}px;left:0;opacity:1;background-color:#fff`
      } else {
        document.querySelector('.song').style.transform = `translateY((${-50 / 3.75})vw)`
        songController.style.cssText = `none`
      }
    }
    document.addEventListener('touchmove', eleMove)
    document.addEventListener('touchend', () => {
      this.removeEventListener('touchmove', eleMove)
      cover.style.transition = 'all .7s'
      coverBg.style.transition = 'all .7s'
      cover.style.height = (375) / 3.75 + 'vw'
      coverBg.style.backgroundSize = (100) + '%'
    })
  })
}
function initSongList(el, config) {
  let root = null
  if (el instanceof HTMLElement) root = el
  if (typeof el === 'string') root = document.querySelector(el)
  if (!root) throw new Error('el必须是一个存在的元素')
  if (!config || typeOf(config.dataSource) !== 'array') throw new Error('config.dataSource必须是数组')
  let songList = createElement('div', { className: 'song-list' })
  config.dataSource.forEach((item, index) => {
    let element = createElement('a', { href: '#', className: 'song-list-item', _customData: item.id }, `
        <div class="song-list-item-left">
          <span class="song-list-item-left-id">${index + 1}</span>
          <div class="song-list-item-left-songName">
            <div class="song-list-item-left-songName-top">
              <h3>${item.name}</h3>
            </div>
            <div class="song-list-item-left-songName-bottom">
              <span>沉浸声</span>
              <p>${item.ar[0].name}</p>
            </div>
          </div>
        </div>
        <i class="iconfont song-list-item-right">&#xe60d;</i>
      `)
    songList.appendChild(element)
  })
  root.parentElement.replaceChild(songList, root)
  let songListLength = songList.children.length
  document.querySelector('.song-controller-left span').innerHTML = `(${songListLength})`
  initScroll(songList)
}
initSongList('.song-list', {
  dataSource: songlist.songs,
  callback: function (e) {
    console.log(e);
  }
})