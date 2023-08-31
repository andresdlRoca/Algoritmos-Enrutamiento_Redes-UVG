# Algoritmo de Flooding

## Prerequisitos
- node v16.15.^

## Dependencias
- readline
- nodemon

## Uso
En terminal
```
npm run start
```
o
```
node index.js
```
Cada instancia del programa es un nodo, por lo que si se quisieran representar varios nodos se deben de abrir varias terminales corriendo el programa.
El programa en si contiene un menu que le permite al usuario identificar el nodo y sus vecinos para que el algoritmo pueda conocer la topologia de la red a base de los vecinos. 
Para esta iteracion del programa manualmente se pueden enviar y recibir mensajes. Cuando se recibe un mensaje este automaticamente se reenvia a todos los vecinos del nodo.

