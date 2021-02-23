// SDK de Mercado Pago
const mercadopago = require ('mercadopago');
mercadopago.configure({
  platform_id: 'PLATFORM_ID',
  integrator_id: ' dev_2e4ad5dd362f11eb809d0242ac130004',
  corporation_id: 'CORPORATION_ID',
access_token : "APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439"
});
 generatePreference = async (preference)=>{
    try {
      let respuesta = await mercadopago.preferences.create(preference)
      return respuesta
    } catch (error) {
      console.log(error);
      return  false
    }  
  }
  getUsuario = async(email)=>{
    var filters = {
      email
    };
    
    try {
      let customer = await mercadopago.customers.search({
        qs: filters
      })
      return customer;
    } catch (error) {
      console.log(error);
      return error
    }
    
  }
  module.exports={generatePreference,getUsuario}

  


  



