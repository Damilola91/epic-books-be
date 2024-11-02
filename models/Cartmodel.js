const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  //TODO:fai questa cosa
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booksModel",
    },
  ],
});

{
  /*1. Eliminare guest login
    2. Se sono guest nascondere tutti form e pulsanti di azioni,
    creare un componente astratto che mi mostri una scritta per effettuare azioni registrati o fai il login al sito
    3. Order Schema, salvare gli ordini a database, se è un utente registrato, salvare la relazione e l'utente, ma se non è registrato
    non lo attribuirà a nessun utente quindi non lo pusherà
    4.Usare API strive per il pagamento
    5. Guarda questa API: https://docs.stripe.com/sdks/stripejs-react
    6. Far scomparire i pulsanti registrati e login appena l'utente è loggato o è registrato.*/
}
