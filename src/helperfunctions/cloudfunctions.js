import { getFunctions,httpsCallable } from 'firebase/functions';
import { getAnalytics, logEvent } from "firebase/analytics";
import { collection,addDoc,getFirestore} from "firebase/firestore";

export function verifyPaystack(info,response){
    const functions =  getFunctions();
    const verify = httpsCallable(functions, 'payStackTransctionVerification');
    const firestore = getFirestore()
    verify({info:info,response:response })
    .then((result) => {
        console.log(response.status)
        console.log(result)
        if(response.status === 'success'){
         const items =   info.items.map((item)=>{
             
              return {item_name:item.name,price:item.price,discount:item.discount,quantity:item.quantity,currency:'GHS'}
            })
         const analytics = getAnalytics();
         logEvent(analytics,'purchase',{currency:'GHS',transaction_id:response.reference,value:info.amount,items:items})
         
         console.log(info)
         addDoc(collection(firestore,'mail'),{
            to:['nbangba.la@gmail.com'],
            template: {
                name:'orderStatus',
                data:{
                    ...info,
                    orderStatus:'received'
                }
            }
        }) 
        .catch((e)=>console.log(e))
        console.log('success')
        }
        //window.location = "http://localhost:8000/verification/" + response.reference;   
    })
    .catch((err)=>console.log(err))  
}

export function chargeCard(info,cardId){
    const functions =  getFunctions();
    const chargeCardFn = httpsCallable(functions, 'chargeCard');

    chargeCardFn({info:info,docId:cardId})
    .then((result)=>{console.log(result)})
    .catch((e)=>console.log(e))
}

export function payOnDelivery(info){
    const functions =  getFunctions();
    const payOnDeliveryFn = httpsCallable(functions, 'payOnDelivery');

    payOnDeliveryFn({info:info})
    .then(()=>{console.log('Order Sent')})
    .catch((e)=>console.log(e))
}

export  function refund(order){
    const functions =  getFunctions();
    const createRefund = httpsCallable(functions, 'createRefund');
    const firestore = getFirestore()

 createRefund({transactionID:order.response.reference,amount:(order.order.amount*100)+""})
 .then((result)=>{ addDoc(collection(firestore,'mail'),{
    to:['nbangba.la@gmail.com'],
    template: {
        name:'orderStatus',
        data:{
            ...order.order,
            orderStatus:'cancelled'
        }
      }
}) 
console.log(result)})
 .catch((e)=>console.log(e))  
}

export async function deleteUsers(selectedRows){
    const functions =  getFunctions();
    console.log(selectedRows)
    const selected = selectedRows.map(e=>e.original)
    console.log(selected)
    const deleteUsersFn = httpsCallable(functions, 'deleteUsers');
   const data = await deleteUsersFn({selectedRows:selected})
   console.log(data)
   if(data.data && data.data.result.length>0)    
    return 'success'
   else
    return 'error'
}

export  function assignRole(role,selectedRows){
    const selected = selectedRows.map(e=>e.original)
    const functions =  getFunctions();
    const assignRoleFn = httpsCallable(functions, 'assignRole');
    assignRoleFn({role:role,selectedRows:selected})
    .then((data)=>console.log("User assigned role "+data))
    .catch((e)=>console.log(e))
}

export function rateProduct(values){
    const functions =  getFunctions();
    const rateProductFn = httpsCallable(functions, 'rateProduct');

    rateProductFn({values:values})
    .then(()=> console.log('You rated this product'))
    .catch((e)=>console.log(e))
}