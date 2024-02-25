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
  'https://picsum.photos/100/100',)
 

console.log (Track.getList())

//----------------------------------
class Playlist {
    //Статичне приватне поле для зберігання списку об'єкту playlist
    static #list = []

    constructor(name) {
      this.id = Math.floor(1000 + Math.random() * 9000) //генруємо випадкове id
      this.name = name
      this.tracks = []
      this.image = 'https://picsum.photos/100/100'
      
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

      let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

      playlist.tracks.push(...randomTracks)
    }

    static getById(id) {
      return (
        Playlist.#list.find(
          (playlist) => playlist.id === id
          )
           || null
      )
    }

    deleteTrackById(trackId) {
      this.tracks = this.tracks.filter(
        (track) => track.id !== trackId,
      )
    }

    static findListByValue(name) {
      return this.#list.filter((playlist) =>
        playlist.name.toLowerCase().includes(name.toLowerCase()),
      )
    }
    
}

Playlist.makeMix(Playlist.create('Test1'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))

//============================================================


router.get('/', function (req, res) {

  res.render('spotify-choose', {

     style: 'spotify-choose',

    data: {},
  })
 
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
  
})
// -------------------------------------------------------------
router.post('/spotify-create', function (req, res) {

  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
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

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })  
})

//----------------------------------

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
  const playlist = Playlist.getById(id)

 if (!playlist) {
  return res.render('alert', {
    style: 'alert',
    data: {
      message: 'Помилка!',
      info: 'Такого плейлиста не знайдено',
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
})

//---------------------------------------------

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId);
  const trackId = Number(req.query.trackId);

  const playlist = Playlist.getById(playlistId);

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка!',
        info: 'Такого плейлиста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`, 
      },
    })
  }

  playlist.deleteTrackById(trackId);

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
//-----------------------------------------------------------
router.get('/spotify-add-track', function (req, res) {   
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)
  const allTracks = Track.getList()

  // console.log(playlistId, allTracks,)

res.render('spotify-add-track', {
  style: 'spotify-add-track',
  data: {
    playlistId: playlist.id,  
    tracks: allTracks,   
  },
  })  
})
//------------------------------------------------------------------
router.post('/spotify-add-track', function (req, res) {
  const playlistId = Number(req.body.playlistId)
  const trackId = Number(req.body.trackId) 

  const playlist = Playlist.getById(playlistId)  
  
  if (!playlist) {
  return res.render('alert', {
    style: 'alert',
    data: {
      message: 'Помилка',
      info: 'Такого плейліста не знайдено',
      link: `/spotify-playlist?id=${playlistId}`,
    },
  })
}
const trackToAdd = Track.getList().find(
  (track) => track.id === trackId,
)

if (!trackToAdd) {
  return res.render('alert', {
    style: 'alert',
    data: {
      message: 'Помилка!',
      info: 'Такого треку не знайдено',
      link: `/spotify-add-track?playlistId=${playlistId}`,
    },
  })
}

playlist.tracks.push(trackToAdd)

res.render('spotify-playlist', {
  style: 'spotify-playlist',
  data: {
      playlistId: playlist.id,    
      tracks: playlist.tracks.reverse(),
      name: playlist.name,
    }
  })  
})

//--------------------------------------

router.get('/spotify-search', function (req, res) {
  const value = ''
 
  const list = Playlist.findListByValue(value)

   res.render('spotify-search', {
    style: 'spotify-search',

    data: {
     list: list.map(({ tracks, ...rest}) => ({
      ...rest,
      amount: tracks.length,
     })),
     value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
 
  const list = Playlist.findListByValue(value)

  console.log (value)

   res.render('spotify-search', {
    style: 'spotify-search',

    data: {
     list: list.map(({ tracks, ...rest}) => ({
      ...rest,
      amount: tracks.length,
     })),
     value,
    },
  })
})

//-----------------------------------------------



router.get('/spotify-list', function (req, res) {
  const value = ''
    
  const list = Playlist.findListByValue(value)
  const listPlaylist = Playlist.getList()

  console.log('spotify-list:', listPlaylist, )  


res.render('spotify-list', {
  style: 'spotify-list',
  data: {
    name: 'Моя бібліотека',

    playlists: listPlaylist,
    
    list: list.map(({ tracks, ...rest}) => ({
     ...rest,
     amount: tracks.length,
    })),
    value,     
  }
  })  
})


// ↑↑ сюди вводимо JSON дані
//=========================================================
// Підключаємо роутер до бек-енду
module.exports = router
