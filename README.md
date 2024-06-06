# Référentiel des Travaux des Équipes

Ce référentiel Git est dédié au stockage de tous les travaux réalisés par les équipes PFE Talan Consulting 2024. Chaque équipe dispose de sa propre branche où elle peut pousser ses travaux sans fusionner directement avec la branche principale. Cela permet une séparation claire des efforts de développement tout en facilitant la gestion des versions.

## Structure du Référentiel

Le référentiel est structuré en sous-répertoires correspondant à chaque équipe et à leur technologie respective :

1. **Équipe Data Science :**
   - Ce répertoire contient les projets, les notebooks Jupyter, les scripts Python et toute autre ressource pertinente liée aux travaux de l'équipe Data Science.

2. **Équipe Angular Spring Boot :**
   - Ce répertoire contient les projets Angular, les applications Spring Boot, les fichiers de configuration et les autres éléments nécessaires au développement des applications basées sur Angular et Spring Boot.

3. **Équipe React Spring Boot :**
   - Ce répertoire est réservé aux projets React, aux applications Spring Boot associées, ainsi qu'à toute autre ressource utilisée par l'équipe travaillant sur React et Spring Boot.

4. **Équipe Testing :**
   - Ce répertoire contient les scénarios de test, les cas de test, les scripts de test automatisé, les rapports de test et autres documents relatifs aux activités de test réalisées par l'équipe.

## Workflow de Contribution

Chaque équipe suit un processus de contribution similaire pour pousser ses travaux dans le référentiel :

1. **Cloner le Référentiel :**
   - Chaque membre de l'équipe clone le référentiel sur sa machine locale en utilisant la commande `git clone`.

2. **Créer une Branche :**
   - Pour chaque tâche ou fonctionnalité, créez une nouvelle branche à partir de la branche spécifique à votre équipe.

3. **Travailler sur votre Tâche :**
   - Effectuez vos modifications, ajoutez de nouveaux fichiers ou apportez des améliorations selon les besoins de votre tâche.

4. **Pousser vos Modifications :**
   - Une fois vos modifications terminées, poussez votre branche vers le référentiel distant en utilisant la commande `git push`.

5. **Mise à Jour de la Branche Principale :**
   - Les responsables de chaque équipe sont chargés de fusionner ou réintégrer les branches des membres de leur équipe dans la branche principale, si et quand ils le jugent approprié.


# Tavail Talent Management
Le projet Talent Management est réalisé par Tawfik Brahim & Mehrez Ganouchi .

# Application de Gestion des Talents
```
git clone https://github.com/DorraBoutiti/PFE-Talan-2024-codes/tree/TalentManagment---Tawfik-Brahim-&-Mehrez-Gannouchi
cd TalentManagment
```
## Description

L'application de gestion des talents est divisée en deux composants principaux :
- **Talent-Management-recommender** : Contient des fonctionnalités d'IA générative, exécutées sur un serveur Flask.
- **Talent-Management-web** : Contient les serveurs frontend et backend, y compris une application React, un serveur Node, et un autre serveur Flask.

## Table des Matières
- [Installation](#installation)
  - [talent-management-recommender](#talent-management-recommender)
  - [talent-management-web](#talent-management-web)
- [Utilisation](#utilisation)
- [Fonctionnalités](#fonctionnalités)
- [Contribuer](#contribuer)
- [Licence](#licence)
- [Contact](#contact)

## Installation

### talent-management-recommender

1. Clonez le dépôt et accédez au répertoire `talent-management-recommender` :
    ```bash
    cd talent-management-recommender
    ```

2. Créez un environnement virtuel :
    - Sous Linux :
        ```bash
        python3 -m venv env
        ```
    - Sous Windows :
        ```cmd
        python -m venv env
        ```

3. Activez l'environnement virtuel :
    - Sous Linux :
        ```bash
        source env/bin/activate
        ```
    - Sous Windows :
        ```cmd
        .\env\Scripts\activate
        ```

4. Installez les packages requis :
    ```bash
    pip install -r requirements.txt
    ```

5. Exécutez le serveur Flask :
    ```bash
    python app.py
    ```
    Le serveur fonctionnera sur le port 4500.

### talent-management-web

#### Application React

1. Accédez au répertoire `react-app` :
    ```bash
    cd react-app
    ```

2. Installez les dépendances et démarrez l'application :
    ```bash
    npm install
    npm run start
    ```
    Ou avec yarn :
    ```bash
    yarn install
    yarn start
    ```
    L'application fonctionnera sur le port 3000.

#### Serveur Node

1. Accédez au répertoire `node-server` :
    ```bash
    cd node-server
    ```

2. Installez les dépendances et démarrez le serveur :
    ```bash
    npm install
    npm start
    ```
    Le serveur fonctionnera sur le port 5000.

#### Serveur Flask

1. Accédez au répertoire `flask-server` :
    ```bash
    cd flask-server
    ```

2. Créez un environnement virtuel s'il n'existe pas :
    - Sous Linux :
        ```bash
        python3 -m venv venv
        ```
    - Sous Windows :
        ```cmd
        python -m venv venv
        ```

3. Activez l'environnement virtuel :
    - Sous Linux :
        ```bash
        source venv/bin/activate
        ```
    - Sous Windows :
        ```cmd
        .\venv\Scripts\activate
        ```

4. Installez les packages requis :
    ```bash
    pip install -r requirements.txt
    ```

5. Exécutez le serveur Flask :
    ```bash
    python app.py
    ```
    Le serveur fonctionnera sur le port 4500.

## Utilisation

Pour utiliser l'application de gestion des talents, assurez-vous que tous les serveurs sont en cours d'exécution comme décrit dans la section d'installation. Vous pouvez ensuite accéder au frontend via l'application React fonctionnant sur le port 3000.





