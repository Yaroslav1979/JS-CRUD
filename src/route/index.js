// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []

  static #count = 0

  constructor(img, title, description, category, price, amount = 0) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }
  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
      }

    static getList = () => {
      return this.#list
    }

    static getById = (id) => {
    return this.#list.find((product) => product.id === id)
    }

    static getRandomList = (id) => {
      const fileredList = this.#list.filter(
        (product) => product.id !== id,
      )

      const shuffledList = fileredList.sort(
        () => Math.random() - 0.5,
      )

      return shuffledList.slice(0.3)
    }
  }

Product.add(
      'https://picsum.photos/200/300',
      "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/",
      "AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС",
      [
        {id: 1, text: 'Готовий для відправлення'},
        {id: 2, text: 'Топ продажів'},
      ],
      27000,
      10
  )

Product.add(
      'https://picsum.photos/200/300',
      "Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel",
      "Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux",
      [
       {id: 2, text: 'Топ продажів'},
      ],
      17000,
      10
  )

Product.add(
      'https://picsum.photos/200/300',
      "Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)",
      "Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС",
      [
       {id: 1, text: 'Готовий для відправлення'},
      ],
      40000,
      10
  )

class Purchase {
        static DELIVERY_PRICE = 150
        static #count = 0
        static #list = []

        constructor(data, product) {
          this.id = ++Purchase.#count

          this.firstname = data.firstname
          this.lastname = data.lastname

          this.phone = data.phone
          this.email = data.email

          this.comment = data.comment || null

          this.bonus = data.bonus || 0

          this.promocode = data.promocode || null

          this.totalPrice = data.totalPrice
          this.productPrice = data.productPrice
          this.deliveryctPrice = data.deliveryctPrice
          this.amount = data.amount

          this.product = data.product
        }

        static add = (...arg) => {
          const newPurchase = new Purchase(...arg)

          this.#list.push(newPurchase)

          return newPurchase
        }

        static getList = () => {
          return Purchase.#list.reverse()
        }

        static getById = (id) => {
          return Purchase.#list.find((item) => item.id === id)
        }

        static updateById = (id, date) => {
          const purchase = Purchase.getById(id)

          // const purchase = Purchase.#list.find(
          //   (item) => item.id === id)
        
        if (purchase) {
          if (data.firstname) purchase.firstname = data.firstname
          if (data.lastname) purchase.lastname = data.lastname
          if (data.phone) purchase.phone = data.phone
          if (data.email) purchase.email = data.email

          return true
        } else {
          return false
        }
      }       
}
      

// ====================================================

// // router.get Створює нам один ентпоїнт

// // ↙️ тут вводимо шлях (PATH) до сторінки
// router.get('/', function (req, res) {
//   // res.render генерує нам HTML сторінку

//   // ↙️ cюди вводимо назву файлу з сontainer
//   res.render('alert', {
//     // вказуємо назву папки контейнера, в якій знаходяться наші стилі
//     style: 'alert',

//     data: {
//       message: 'Операція успішна!',
//       info: 'Товар створений',
//       link: '/test-path',
//     }
//   })
//   // ↑↑ сюди вводимо JSON дані
// })

// ================================================================


router.get('/', function (req, res) {

  res.render('purchase-index', {

     style: 'purchase-index',

    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

//=========================================================


router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {

     style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ------------------------------------

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  const product = Product.getById(id)

 
  if(amount < 1) {
   return res.render('alert', {
      style: 'alert',
      data: {
       message: 'Error! / Помилка!',
       info: 'Incorret amount / Некоректна кількість товару',
       link: `/purchase-product?id=${id}`,
     },
    })
  }

  if(product.amount < 1) {
    return res.render('alert', {
       style: 'alert',
       data: {
        message: 'Error! / Помилка!',
        info: 'Даної кількості товару нема в наявності',
        link: `/purchase-product?id=${id}`,
      },
     })
   }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE

  // res.render('purchase-product', {
  //    style: 'purchase-product',
  //     data: {
  //     list: Product.getRandomList(id),
  //     product: Product.getById(id),
  //     },
  //   })


    res.render('purchase-create', {
      style: 'purchase-create',
       data: {
        id: product.id,
        cart: [
          {
            text: `${product.title} (${amount} шт)`,
            price: productPrice,
          },
          {
            text: `Доставка`,
            price: Purchase.DELIVERY_PRICE,
          }
        ],
         totalPrice,
         productPrice,
         deliveryPrice: Purchase.DELIVERY_PRICE,
         amount,
       },
     })
  // ↑↑ сюди вводимо JSON дані
})
// -----------------------------------------------------

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    phone,
    email
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка!',
        info: 'Товар не знайдено',
        link: "/purchase-list",
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: "Помилка",
        info: 'Товару нема в потрібній кількості',
        link: "/purchase-list",
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)

  if (
   isNaN(totailPrice) ||
   isNaN(productPrice) ||
   isNaN(deliveryPrice) ||
   isNaN(amount)     
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка!',
        info: 'Некоректні дані',
        link: "/purchase-list",
      },
    })
  }

  if (!firstname || !lastname || !phone || !email) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: "Заповніть обов'язкові поля",
        info: 'Некоректні дані',
        link: "/purchase-list",
      },
    })
  }

  const purchase = Purchase.add(
    {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    phone,
    email
    },
    product,
  )

  console.log(purchase)
  
  res.render('alert', {
     style: 'alert',
      data: {
        message: 'Успішно!',
        info: 'Замовлення створено',
        link: "/purchase-list",
      },
    })
  // ↑↑ сюди вводимо JSON дані
})

//=========================================================
// Підключаємо роутер до бек-енду
module.exports = router
