#!/bin/bash

# Variáveis de conexão
USUARIO="App_mdb"
SENHA="nJkn86qjYvUjlwpJ"
CLUSTER="ps-terapia.8dgyy1d.mongodb.net"
DATABASE="seenti_db"

# Comando de conexão
mongosh "mongodb+srv://$USUARIO:$SENHA@$CLUSTER/$DATABASE" --username $USUARIO

