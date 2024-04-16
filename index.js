import { FormData } from 'formdata-node';
import fetch, { blobFrom } from 'node-fetch';
import fs from 'fs';



const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));



const orders = loadJSON('./orders.json')

const tobeUpdated = []
let tally = 0
for(let order of orders){
  let ticketsFound = false
  console.log(order.id)
  for(let note of order.note_attributes){
    console.log(note)
    if(note.name == "tickets"){
      ticketsFound = true
      console.log('found')
    }
  }

  if(ticketsFound){
    continue
  }

  tobeUpdated.push({
    orderId: order.id,
    email: order.contact_email
  })

  let res = await fetch('https://store.baddworldwide.com/api/update_tickets', {
    method: 'POST',
    body: JSON.stringify(order),
    headers:{
      'content-type': 'application/json'
    }
  })

  console.log(await res.text())

  console.log(JSON.stringify(tobeUpdated))
  console.log(tobeUpdated.length+" out of 4075")
}

fs.writeFile('updated.json', JSON.stringify(tobeUpdated, null, 2), err => {
  if (err) throw err;
  console.log('Saved to updated.json');
});

console.log(tally)
console.log(orders.length)

