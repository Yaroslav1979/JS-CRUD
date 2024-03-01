// Підключаємо технологію express для back-end сервера
const express = require('express')

// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ------------------------------------------------------

class Product {
  //Статичне приватне поле для зберігання списку об'єкту Product
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description    
    this.id = Math.floor(Math.random() * 10000) //генруємо випадкове id
    this.createDate = () => {
    this.date = new Date().toISOString()
  };
    

  }
//Статичний метод для створення об'єкту Product і додавання його до списку #list
  // static create(name, price, description, id) {
  //   const newProduct = new Product(name, price, description, id)
  //   this.#list.push(newProduct)
  //   return newProduct
  // }

  //Статичний метод ля отримання всього списку продуктів
  static getList() {
    return this.#list
  }

  checkId = (id) => this.id === id

  static add = (product) => { 
    this.#list.push(product)
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
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

  // static updateById = (id, data) => {
  //   const product = this.getById(id);
  //   const {name} = data
  //   if (product) {
  //     if(name) {
  //       product.name = name
  //     }   
  //       return true
  //     } else {
  //       return false
  //     }
  //     }

      static updateById = (id, data) => {
        const productIndex = this.#list.findIndex((product) => product.id === id);
      
        if (productIndex !== -1) {
          const product = this.#list[productIndex];
          const { name } = data;
      
          if (name) {
            product.name = name;
          }
      
          return true;
        } else {
          return false;
        }
      }

  static update = (name, {product} ) => {
    if (name) {      
       product.name = name      
     }
   }  
}

// Product.add(
//   "Спортивні кросівки",
//   "1200",
//   "Зручні та стильні кросівки для активного способу життя",
// )

//============================================================


router.get('/', function (req, res) {

  res.render('product-create', {

     style: 'product-create',

    data: {},
  })
 
})

//=========================================================
router.get('/product-create', function (req, res) {

  const list = Product.getList()
  
  res.render('product-create', {
    style: 'product-create',
    data: {
      list,
    },
  })  
})
// -------------------------------------------------------------

 
  router.post('/product-create', function (req, res) {
    const id = Number(req.body.id)
    const {name, price, description} = req.body;
    const product = new Product(name, price, description)
    Product.add(product)
    console.log(Product.getList())

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


//------------------------------------------------


router.get('/product-list', function (req, res) {

  const productList = Product.getList();

    res.render('product-list', {
    component: ['button', 'product-card', 'divider'],
    style: 'product-list',
    data: {
      products: {
        productList,
        isEmpty: productList.length === 0,
      }
    },
  })
  
})
//----------------------------------------------------------
router.get('/product-edit', function (req, res) {
  const id = Number(req.query.id);
  const product = Product.getById(id);

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      data: {
        product,
      },
    });
  } else {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар з таким ID не знайдено',
        link: '/product-list', 
      },
    });
  }
});

//--------------------------------------------

router.post('/product-edit', function (req, res) {
  const id = Number(req.body.id);
  const updatedProduct = Product.updateById(id, req.body);

  if (updatedProduct) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Успiшно!',
        info: 'Товар оновлено',
        link: '/product-list'
      }
    });
  } else {
    res.render('product-edit', {
      style: 'product-edit',
      data: {
        message: 'Помилка',
        info: 'Не вдалося оновити товар',
        link: '/product-edit?id=' + id,
      },
    });
  }
});

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

