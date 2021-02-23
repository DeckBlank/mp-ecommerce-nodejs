require('dotenv').config()
var express = require('express');
var exphbs  = require('express-handlebars');
const generatePreference = require('./mercadopago')

var port = process.env.PORT || 3000

var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
app.use(express.json())
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', async  (req, res) => {
    
    res.render('detail', {...req.query});
});


app.post('/create_preference', async (req, res) => {
  
  let preference = {
		items: [{
      id:1234,
			title: req.body.description,
			unit_price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      picture_url: req.body.img,
      description : "Dispositivo móvil de Tienda e-commerce"
		}],
    payer: {
        name: "Lalo",
        surname: "Landa",
        email: "test_user_46542185@testuser.com",
        phone: {
            "area_code": "52",
            "number": "5549737300"
        },
        identification: {
            "type": "DNI",
            "number": "22334445"
        },
        address: {
            "street_name": "Insurgentes Sur",
            "street_number": 1602,
            "zip_code": "03940"
        }
    },
		"payment_methods": {
			"excluded_payment_methods": [
				{
					"id": "diners"
				}
			],
			"excluded_payment_types": [
				{
					"id": "atm"
				}
			],
			"installments": 6
		},
		back_urls: {
			success: `${process.env.BACKEND}/estado-pago/success`,
			failure: `${process.env.BACKEND}/estado-pago/failure`,
			pending: `${process.env.BACKEND}/estado-pago/pending`
		},
		external_reference: process.env.EMAIL,
		auto_return: 'approved',
    notification_url:`${process.env.BACKEND}/webhooks`,
	};
  console.log(preference);
  let respuesta = await generatePreference(preference);
  if(!respuesta){
    console.log('algo fallo');
    res.status(500);
  }else{
    console.log({id:respuesta.body.id,initPoint:respuesta.body.init_point});
    res.json({id:respuesta.body.id,initPoint:respuesta.body.init_point})
  }

});

app.get('/estado-pago/:status', function(req, res) {
    let status = req.params.status
    let respuesta = '';
    switch (status) {
      case 'success':
        respuesta = 'Felicitacion tu pago ha sido aprobado.'
        break;
      case 'failure':
        respuesta = 'Ojo! tu pago esta pendiente.'
      break;
      case 'pending':
        respuesta = 'Oops! tu pago esta cancelado, comunicate con tu banco.'
        break;
    }
	  res.render('estadoPago', {status:respuesta});
});
app.post('/webhooks', function(req, res) {
  console.log('=D',req.body);
  res.json(req.body)
});

app.listen(port,(e)=>{
    console.log(`app en puerto ${port}`);
});
