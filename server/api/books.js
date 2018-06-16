const router = require('express').Router()
// import axios} from 'axios'
const axios = require('axios')
const Book = require('../db/models/book')
const job = require('../cron')
// const {User} = require('../db/models')
//   try {
//     // let job = await new cron.CronJob({
//     //   cronTime: '00 00 05 * * 1-5',
//     //   onTick: function() {
//     //     // const {data} = axios({
//     //     //   method: 'get',
//     //     //   url:
//     //     //     'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json',
//     //     //   params: {
//     //     //     'api-key': '77d24cf3145c4403b9bb17e414892841'
//     //     //   }
//     //     // })
//     //     // res.send(data)
//     //     console.log('hello pup')
//     //   },
//     //   start: true,
//     //   timeZone: 'America/New_York'
//     // })

//     // console.log('job status', job.running) // job1 status undefined
//     const {data} = await axios({
//       method: 'get',
//       url:
//         'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json',
//       params: {
//         'api-key': '77d24cf3145c4403b9bb17e414892841'
//       }
//     })
//     res.send(data)
//   } catch (err) {
//     next(err)
//   }
//   // User.findAll({
//   //   // explicitly select only the id and email fields - even though
//   //   // users' passwords are encrypted, it won't help if we just
//   //   // send everything to anyone who asks!
//   //   attributes: ['id', 'email']
//   // })
//   //   .then(users => res.json(users))
//   //   .catch(next)
// })

router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll()
    res.send(books)
  } catch (err) {
    next(err)
  }
})

// router.post('/', (req, res, next) => {
//   try {
//     Book.create({
//       title: job.title,
//       description: job.description,
//       author: job.author,
//       isbn3: job.isbns.isbn3
//     })
//   } catch (err) {
//     next(err)
//   }
// })

module.exports = router
