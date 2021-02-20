

  var orderData = {
    description: document.getElementById("product-description").innerHTML,
    price: document.getElementById("unit-price").innerHTML,
    quantity: document.getElementById("quantity").innerHTML,
    img: document.getElementById("phoneImg").src,
    
  };
  const preferencia = async ()=>{
    try{
      let code = await fetch("/create_preference", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(orderData),
        })
        let res = await code.json();
         createCheckoutButton(res.id,res.initPoint);
        }catch(e){
               alert("Unexpected error" + JSON.stringify(e));
        }
    
  }
  preferencia();


//Create preference when click on checkout button
function createCheckoutButton(preference,initPoint) {
  var script = document.createElement("script");
  
  // The source domain must be completed according to the site for which you are integrating.
  // For example: for Argentina ".com.ar" or for Brazil ".com.br".
  script.src = "https://www.mercadopago.com.pe/integrations/v1/web-payment-checkout.js";
  script.type = "text/javascript";
  script.setAttribute('data-button-label',"Pagar la compra")
  script.dataset.preferenceId = preference;
  document.getElementById("button-checkout").innerHTML = "";
  document.querySelector("#button-checkout").appendChild(script);

  let initPointButton = document.querySelector('#initPoint')
  initPointButton.textContent = 'Pagar la compra'
  initPointButton.href = initPoint;
  initPointButton.classList.remove('none')
}