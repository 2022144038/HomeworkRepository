const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

let products = [
    {
        id : 1,
        name: "HTML,CSS 입문 예제 중심",
        jpg: "./images/1.jpg",
        category: "HTML",
        price : 1000
    },
    
    {
        id : 2,
        name: "러닝스쿨! 한 권으로 끝내는 HTML+CSS 웹 디자인 입문",
        jpg: "./images/2.jpg",
        category: "HTML",
        price : 2000
    },
    
    {
        id : 3,
        name: "생활코딩! HTML+CSS+자바스크립트",
        jpg: "./images/3.jpg",
        category: "HTML",
        price : 3000
    },

    {
        id : 4,
        name: "CSS 완벽 가이드",
        jpg: "./images/4.jpg",
        category: "CSS",
        price : 1000
    },
    
    {
        id : 5,
        name: "다양한 예제로 배우는 CSS 설계 실전 가이드",
        jpg: "./images/5.jpg",
        category: "CSS",
        price : 2000
    },
    
    {
        id : 6,
        name: "웹 디자인, 이렇게 하면 되나요",
        jpg: "./images/6.jpg",
        category: "CSS",
        price : 3000
    },

    {
        id : 7,
        name: "Java의 정석",
        jpg: "./images/7.jpg",
        category: "JAVA",
        price : 1000
    },
    
    {
        id : 8,
        name: "Lets 실전예제로 배우는 자바 프로그래밍(Java Programming)",
        jpg: "./images/8.jpg",
        category: "JAVA",
        price : 2000
    },
    
    {
        id : 9,
        name: "그림으로 배우는 Java Programming",
        jpg: "./images/9.jpg",
        category: "JAVA",
        price : 3000
    },

    {
        id : 10,
        name: "Oxygen XML Editor Version 12 User Manual",
        jpg: "./images/10.jpg",
        category: "XML",
        price : 1000
    },
    
    {
        id : 11,
        name: "The XML 1.0 Standard (5th Edition)",
        jpg: "./images/11.jpg",
        category: "XML",
        price : 2000
    },
    
    {
        id : 12,
        name: "XML Path Language (Xpath) 2.0 Standard",
        jpg: "./images/12.jpg",
        category: "XML",
        price: 3000
    }
];

app.post('/product/:productId/review', (request, response) => {
    const productId = parseInt(request.params.productId);
    const product = products.find(product => product.id === productId);
    if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {const review = request.body;
        if (!product.reviews) {
            product.reviews = [];
        }
        product.reviews.push(review);

        const dirPath = path.join(__dirname, 'comment.json');
        fs.readFile(dirPath, 'utf8', (err, data) => {
            let comments = [];
            if (data) {
            comments = JSON.parse(data);
            }
            comments.push({ productId, review });
            fs.writeFile(dirPath, JSON.stringify(comments), 'utf8', (err) => {});
        });
    }
});

app.get('/product/:productId', (request, response) => {
    const productId = parseInt(request.params.productId);
    const product = products.find(product => product.id === productId);
    if (!product) {
        response.status(404).send('Product not found');
    } else {
        if (!product.reviews) {
            product.reviews = [];
        }
        let reviews = [];
        const dirPath = path.join(__dirname, 'comment.json');
        fs.readFile(dirPath, 'utf8', (err, data) => {
            if (parseInt(data.productId) == productId) {
            reviews.push(data.review.content);
            }
        });


        response.send(`
            <div style="max-width: 1000px">
                <p>product_id: ${product.id}</p>
                <p>product image: </p> <p><img src="../images/${product.id}.jpg" alt="${product.title}" style="width: 300px;"></p>
                <p>product title: ${product.name}</p>
                <p>product price: ${product.price}원</p>
                <p>product category: ${product.category}</p>
                <form>
                    <input type="text" id="review" name="review" placeholder=" Write your review" style="width : 500px" required>
                    <button onclick="getReview(${productId})">submit</button>
                </form>
                <br>
                <p>Reviews</p>
                <div id="review">
                    ${reviews.map(review => `<p>${review.content}<p>`).join('')}
                </div>
            </div>

        <script>
            function getReview(productId) {
                event.preventDefault();

                const content = document.getElementById('review').value;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content })
                };
                
                fetch('/product/'+productId+'/review', requestOptions)
                    .then(response => {
                    if (response.ok) {
                        console.log('리뷰가 등록되었습니다.');
                    } else {
                        // 요청이 실패했을 때 수행할 작업
                        console.error('리뷰 등록에 실패했습니다.');
                    }
                    })
                    .catch(error => {
                    console.error('요청 처리 중 오류가 발생했습니다.', error);
                });
            }
        </script>
    `);
  }
});

app.get('/product/:productId', (request, response) => {
  const productId = parseInt(request.params.productId);
  const product = products.find(product => product.id === productId);
  if (!product) {
    response.status(404).send('Product not found');
  } else {
    response.redirect(`/product/${productId}/data`); 
  }
});

app.get('/product/:productId/data', (request, response) => {
  const productId = parseInt(request.params.productId);
  const product = products.find(product => product.id === productId);
  if (!product) {
    response.status(404).json({ error: 'Product not found' });
  } else {
    response.json({
      product_id: product.id,
      product_title: product.name,
      product_image: product.jpg,
      product_category: product.category,
      product_price: product.price
    });
  }
});

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login.html', (request, response) => {
  response.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup.html', (request, response) => {
  response.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/product', (request, response) => {
  const db = new sqlite3.Database('product.db');
  db.serialize(() => {
    db.all('SELECT * FROM product', (err, rows) => {
      if (err) {
        console.error(err.message);
        response.status(500).send('Internal Server Error');
      } else {
        response.json(rows);
      }
    });
  });
  db.close();
});

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});