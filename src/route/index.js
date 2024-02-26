// Підключаємо технологію express для back-end сервера
const express = require('express')

// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ------------------------------------------------------

class Product {
  //Статичне приватне поле для зберігання списку об'єкту Product
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 10000) //генруємо випадкове id
    this.createDate = new Date().toISOString();
    this.name = name
    this.price = price
    this.description = description

  }
//Статичний метод для створення об'єкту Product і додавання його до списку #list
  static create(name, price, description, id) {
    const newProduct = new Product(name, price, description, id)
    this.#list.push(newProduct)
    return newProduct
  }

  //Статичний метод ля отримання всього списку продуктів
  static getList() {
    return this.#list.reverse()
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static updateById = (id, data) => {
    const product = this.getById(id);

    if (product) {
      this.update(product, data)

        return true
      } else {
        return false
      }
      }

  static update = (product, {name, price, description} ) => {
    if (name) {
       product.name = name
       product.price = price
       product.description = description
     }
   }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
      )
      if (index !== -1) {
        this.#list.splice(index, 1);
        return true
      } else {
        return false
      }
  }
}

//============================================================


router.get('/', function (req, res) {

  res.render('product-list', {

     style: 'product-list',

    data: {},
  })
 
})

//=========================================================

// -------------------------------------------------------------

 
  router.post('/product-create', function (req, res) {
    const id = Number(req.body.id)
    const {name, price, description} = req.body;
    // const price = Number(req.body.price);
    // const description = req.body.description;
  
    if (!name, !price, !description) {
      return res.render('alert', {
        style: 'alert',
        data: {          
          message: 'Помилка',
          info: "Введіть обов'язкові дані",
          link: '/product-create',
        }
      });
    }
  
    const product = Product.create(name, price, description, id);
  
    if (product) {
      return res.render('alert', {
        style: 'alert',
        data: {
          message: 'Успіх',
          info: 'Товар успішно створено',
          link: '/product-list',
          
        }
      });
    } else {
      return res.render('alert', {
        style: 'alert',
        data: {
          message: 'Помилка',
          info: 'Не вдалося створити товар',
          link: '/product-create',
        }
      });
    }
  });

//------------------------------------------------------
router.get('/product-create', function (req, res) {
  const id = Number(req.query.id)
  const name = req.body.name
  const price = Number(req.body.price)
  const description =  req.body.description
  
  const product = Product.create(name, price, description, id)
  
  res.render('product-create', {
    style: 'product-create',
    data: {
      product,
    },
  })  
})

//------------------------------------------------


router.get('/product-list', function (req, res) {
  const id = Number(req.query.id)
  const name = req.body.name
  const price = Number(req.body.price)
  const description =  req.body.description
  const productList = Product.getList(name, price, description, id);

  
  res.render('product-list', {
    style: 'product-list',
    data: {
      productList,
    },
  })
  
})
//----------------------------------------------------------


// router.get('/spotify-playlist', function (req, res) {
//   const id = Number(req.query.id)
//   const playlist = Playlist.getById(id)

//  if (!playlist) {
//   return res.render('alert', {
//     style: 'alert',
//     data: {
//       message: 'Помилка!',
//       info: 'Такого плейлиста не знайдено',
//       link: '/',
//     }
//   })
// }

// res.render('spotify-playlist', {
//   style: 'spotify-playlist',
//   data: {
//     playlistId: playlist.id,
//     tracks: playlist.tracks,
//     name: playlist.name,
//   }
//   })  
// })

// //---------------------------------------------

// router.get('/spotify-track-delete', function (req, res) {
//   const playlistId = Number(req.query.playlistId);
//   const trackId = Number(req.query.trackId);

//   const playlist = Playlist.getById(playlistId);

//   if (!playlist) {
//     return res.render('alert', {
//       style: 'alert',
//       data: {
//         message: 'Помилка!',
//         info: 'Такого плейлиста не знайдено',
//         link: `/spotify-playlist?id=${playlistId}`, 
//       },
//     })
//   }

//   playlist.deleteTrackById(trackId);

//   res.render('spotify-playlist', {
//     style: 'spotify-playlist',
//     data: {
//       playlistId: playlist.id,
//       tracks: playlist.tracks,
//       name: playlist.name,
//     },
//   })
// })
// //-----------------------------------------------------------
// router.get('/spotify-add-track', function (req, res) {   
//   const playlistId = Number(req.query.playlistId)
//   const playlist = Playlist.getById(playlistId)
//   const allTracks = Track.getList()

//   // console.log(playlistId, allTracks,)

// res.render('spotify-add-track', {
//   style: 'spotify-add-track',
//   data: {
//     playlistId: playlist.id,  
//     tracks: allTracks,   
//   },
//   })  
// })
// //------------------------------------------------------------------
// router.post('/spotify-add-track', function (req, res) {
//   const playlistId = Number(req.body.playlistId)
//   const trackId = Number(req.body.trackId) 

//   const playlist = Playlist.getById(playlistId)  
  
//   if (!playlist) {
//   return res.render('alert', {
//     style: 'alert',
//     data: {
//       message: 'Помилка',
//       info: 'Такого плейліста не знайдено',
//       link: `/spotify-playlist?id=${playlistId}`,
//     },
//   })
// }
// const trackToAdd = Track.getList().find(
//   (track) => track.id === trackId,
// )

// if (!trackToAdd) {
//   return res.render('alert', {
//     style: 'alert',
//     data: {
//       message: 'Помилка!',
//       info: 'Такого треку не знайдено',
//       link: `/spotify-add-track?playlistId=${playlistId}`,
//     },
//   })
// }

// playlist.tracks.push(trackToAdd)

// res.render('spotify-playlist', {
//   style: 'spotify-playlist',
//   data: {
//       playlistId: playlist.id,    
//       tracks: playlist.tracks.reverse(),
//       name: playlist.name,
//     }
//   })  
// })

// //--------------------------------------

// router.get('/spotify-search', function (req, res) {
//   const value = ''
 
//   const list = Playlist.findListByValue(value)

//    res.render('spotify-search', {
//     style: 'spotify-search',

//     data: {
//      list: list.map(({ tracks, ...rest}) => ({
//       ...rest,
//       amount: tracks.length,
//      })),
//      value,
//     },
//   })
// })

// router.post('/spotify-search', function (req, res) {
//   const value = req.body.value || ''
 
//   const list = Playlist.findListByValue(value)

//   console.log (value)

//    res.render('spotify-search', {
//     style: 'spotify-search',

//     data: {
//      list: list.map(({ tracks, ...rest}) => ({
//       ...rest,
//       amount: tracks.length,
//      })),
//      value,
//     },
//   })
// })

// //-----------------------------------------------



// router.get('/spotify-list', function (req, res) {
//   const value = ''
    
//   const list = Playlist.findListByValue(value)
//   const listPlaylist = Playlist.getList()

//   console.log('spotify-list:', listPlaylist, )  


// res.render('spotify-list', {
//   style: 'spotify-list',
//   data: {
//     name: 'Моя бібліотека',

//     playlists: listPlaylist,
    
//     list: list.map(({ tracks, ...rest}) => ({
//      ...rest,
//      amount: tracks.length,
//     })),
//     value,     
//   }
//   })  
// })


// ↑↑ сюди вводимо JSON дані
//=========================================================
// Підключаємо роутер до бек-енду
module.exports = router


// пропозиція від gpt :
// const express = require('express');
// const router = express.Router();

// class Product {
//   static #list = [];

//   constructor(name, price, description) {
//     this.id = Math.floor(Math.random() * 10000);
//     this.createDate = new Date().toISOString();
//     this.name = name;
//     this.price = price;
//     this.description = description;
//   }

//   static create(name, price, description) {
//     const newProduct = new Product(name, price, description);
//     this.#list.push(newProduct);
//     return newProduct;
//   }

//   static getList() {
//     return this.#list.reverse();
//   }

//   static getById(id) {
//     return this.#list.find((product) => product.id === id);
//   }

//   // ... (решта методів залишається незмінною)
// }

// router.get('/product-create', function (req, res) {
//   const productList = Product.getList();
//   res.render('container/product-create', { productList });
// });

// router.get('/product/:id', function (req, res) {
//   const productId = parseInt(req.params.id);
//   const product = Product.getById(productId);

//   if (product) {
//     res.render('container/product-detail', { product });
//   } else {
//     res.render('container/alert', {
//       style: 'alert',
//       data: {
//         message: 'Помилка',
//         info: 'Товар не знайдено',
//         link: '/product-create',
//       }
//     });
//   }
// });

// router.post('/product-create', function (req, res) {
//   const name = req.body.name;
//   const price = Number(req.body.price);
//   const description = req.body.description;

//   if (!name) {
//     return res.render('container/alert', {
//       style: 'alert',
//       data: {
//         message: 'Помилка',
//         info: 'Введіть назву товару',
//         link: '/product-create',
//       }
//     });
//   }

//   const product = Product.create(name, price, description);

//   if (product) {
//     return res.render('container/alert', {
//       style: 'alert',
//       data: {
//         message: 'Успіх',
//         info: `Товар "${name}" успішно створено з id ${product.id}`,
//         link: '/product-create',
//       }
//     });
//   } else {
//     return res.render('container/alert', {
//       style: 'alert',
//       data: {
//         message: 'Помилка',
//         info: 'Не вдалося створити товар',
//         link: '/product-create',
//       }
//     });
//   }
// });

// module.exports = router;