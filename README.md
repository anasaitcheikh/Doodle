# Introduction

*Doodle* est une application web pour planifier des réunions.

# Choix de technologie

- NodeJs
- MongoDB
- Angular CLI

# Installation

Pour exécuter le code il faut :

- Installer : *MongoDB 4.0.2* et *NodeJs*.
- Ouvrir un *Terminal* dans "/bin" qui se trouve dans le dossier d'installation de *MongoDB* et entrer la commande suivante :

```
mongod --dbpath ../data/db
```
- Ouvrir un *Terminal* dans le dossier "/backend" et entrer la commandes suivantes :

```
npm install
```
puis :
```
npm start
```
- Ouvrir un *Terminal* dans le dossier "/frontend" et entrer les commandes suivantes :

```
npm install
```
puis :
```
ng serve -o
```
Cette dernière commande va ouvrir automatiquement le navigateur sur l'adresse : `http://localhost:4200/` qui contient une redirection vers la page d’accueil de l'application web (`http://localhost:4200/welcome`). 

# Utilisation 
On peut créer les réunion en deux modes :
### Avec authentification :
Permet un contrôle total sur les réunions.
### Sans authentification:
Permet un contrôle minimale sur les réunions.
