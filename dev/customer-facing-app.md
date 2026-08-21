# Instructions
- Do all of these in a branch (customer-app)
- If you`re messing into the backend, do it in a branch with the same name

# Feature description:
Right now, the flow of this frontend app is:
 - Customer whatsapps the restaurant
 - Restaurant takes the order, makes the input into the app
 - Sends link/Enters customer info 
 - Customer enters info, restaurant marks preparing

The goal:
 - We would need a public faced customer view (non authenticated) so the process would be:
 - Client initiates a whatsapp conversation
 - Restaurant (or automated whatsapp bot) sends a link
 - Customer opens link, it goes to step 1 a customer page, where he can choose the products (kind of what we do on orders/new), press next
 - Step 2: Customer information, name, phone location (kind of our public link we use as of today)
 - Step 3: Summary + Order payment, client sees the order + a QR code for payment
 The order payment is just a predefined QR the restaurant can put in their profile page (profile page update TBD and stays TBD)
 - Restaurant receives the payment confirmation, marks the order as preparing

