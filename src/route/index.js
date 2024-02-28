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

  static updateById = (id) => {
    const product = this.getById(id);

    if (product) {
      this.update(product)

        return true
      } else {
        return false
      }
      }

  static update = (product, {name, price, description} ) => {
    if (product) {
      product.id = id
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

Product.create (
  "Спортивні кросівки",
  "1200",
  "Зручні та стильні кросівки для активного способу життя",
)

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
  
    if (!name || !price || !description) {
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
          message: 'Успішно!',
          info: 'Товар створено',
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
  const product = Product.create(name, price, description, id)
  const productList = Product.getList();

  
  res.render('product-list', {
    component: ['button', 'product-card', 'divider'],
    style: 'product-list',
    data: {
      productList: {
        product,
        isEmpty: productList.length === 0,
      }
    },
  })
  
})
//----------------------------------------------------------
router.get('/product-edit', function (req, res) {
  const id = Number(req.query.id)
  // const name = req.body.name
  // const price = Number(req.body.price)
  // const description =  req.body.description
  
  const product = Product.getById(id)

 
  res.render('product-edit', {
    style: 'product-edit',
    data: {
      product,
    },
  })  
})

//--------------------------------------------

router.post('/product-edit', function (req, res) {
  const id = Number(req.body.id)
  const name = req.body.name
  const price = Number(req.body.price)
  const description =  req.body.description
  
  const product = Product.updateById (id)

 
  if (product) {
    res.render('alert', {
     
      style: 'alert',
      data: {
       message: 'Успiшно!',
       info: 'Товар оновлено',
       link: '/product-list'
      }
    })
   } else {
     return res.render('alert', {
       style: 'alert',
       data: {
         message: 'Помилка',
         info: 'Не вдалося оновити товар',
         link: '/product-edit',
       }
     });
   }
})

//------------------------------------------
router.get('/product-delete', function (req, res) {
  const {id} = req.query
 
  const success = Product.deleteById(Number(id))
 
  if (success) {
   res.render('alert', {
    
     style: 'alert',
     data: {
      message: 'Успiшно!',
      info: 'Товар видалений',
      link: '/product-list'
     }
   })
  } else {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Не вдалося видалити товар',
        link: '/product-edit',
      }
    });
  }
   
 })



// ↑↑ сюди вводимо JSON дані
//=========================================================
// Підключаємо роутер до бек-енду
module.exports = router

