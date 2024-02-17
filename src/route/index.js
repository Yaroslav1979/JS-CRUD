// Підключаємо технологію express для back-end сервера
const express = require('express')

// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ------------------------------------------------------

class Track {
  //Статичне приватне поле для зберігання списку об'єкту track
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) //генруємо випадкове id
    this.name = name
    this.author = author
    this.image = image
  }
//Статичний метод для створення об'єкту Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  //Статичний метод ля отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }
}

Track.create(
  'Nachtigal',
  'Кому вниз',
  'https://picsum.photos/100/100',
)
Track.create(
  'Так спроквола надходить..',
  'Плач Єремії',
  'https://picsum.photos/100/100',
)
Track.create(
  'Над перевалом',
  'Океан Ельзи',
  'https://picsum.photos/100/100',
)
Track.create(
  'Країна мрій',
  'ВВ',
  'https://picsum.photos/100/100',
)
Track.create(
  'Хто як не ти',
  'Христина Соловій',
  'https://picsum.photos/100/100',
)
Track.create(
  'Буде нам з тобою що згадати',
  'Наші партизани (Чубай)',
  'https://picsum.photos/100/100',
)
Track.create(
  'Фортеця Бахмут',
  'Антитіла',
  'https://picsum.photos/100/100',
)

console.log (Track.getList())

//----------------------------------
class Playlist {
    //Статичне приватне поле для зберігання списку об'єкту track
    static #list = []

    constructor(name) {
      this.id = Math.floor(1000 + Math.random() * 9000) //генруємо випадкове id
      this.name = name
      this.tracks = []
    }

    static create(name) {
      const newPlaylist = new Playlist(name)
      this.#list.push(newPlaylist)
      return newPlaylist
    }

    static getList() {
      return this.#list.reverse()
    }

    static makeMix(playlist) {
      const allTracks = Track.getList()

      let rendomTracks = allTracks.sort(() => 0.5-Math.random()).slice(0, 3)

      playlist.tracks.push(...rendomTracks)
    }
}

//============================================================


router.get('/', function (req, res) {

  res.render('spotify-choose', {

     style: 'spotify-choose',

    data: {
      // list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

//=========================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log (isMix)
  
  res.render('spotify-create', {

     style: 'spotify-create',

    data: {
      isMix
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// -------------------------------------------------------------
router.post('/spotify-create', function (req, res) {

  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Error',
        info: 'Введіть назву плейлиста!',
        link: isMix ? '/spotify-create?isMix=true':'/spotify-create',
      }
    })
  }
 
  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log (playlist)

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно!',
      info: 'Плейлист створено',
      link: `/spotify-playlist?id=${playlist.id}`,
    }
  })  
})

//----------------------------------

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
  const playlist = Playlist.create(id)

 if (!playlist) {
  return res.render('alert', {
    style: 'alert',
    data: {
      message: 'Error',
      info: 'Такого плейлиста не знайдено!',
      link: '/',
    }
  })
}

res.render('spotify-playlist', {
  style: 'spotify-playlist',
  data: {
    playlistId: playlist.id,
    tracks: playlist.tracks,
    name: playlist.name,
  }
})

  // ↑↑ сюди вводимо JSON дані
})


//=========================================================
// Підключаємо роутер до бек-енду
module.exports = router
