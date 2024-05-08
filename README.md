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

# Tavail HrDocumentAnalyzer
Le projet HrDocumentAnalyzer est réalisé par Dorra Boutiti.

## Running Everything Together

To run everything together, use the following command:

```bash
docker-compose up
```
This command will start all services defined in the docker-compose.yml file.

## Running Projects Separately
Run the MySQL Database:

To run the MySQL database separately, you can use the following command:
```bash
docker-compose up mysql-db
```
## Run the NestJS App
To run the NestJS app separately, you can use either of the following commands:
```bash
npm run start:back
```
or
```bash
docker-compose up backend-document-analyzer
```
## Run the React js App
To run the REACT js app separately, you can use either of the following commands:
```bash
npm run start:front
```
or

```bash
docker-compose up frontend-document-analyzer
```
## Cleaning the Database Volume
To clean the database volume, you can use the following command:

```bash
npm run clean
```
or

```bash
docker-compose down -v
```
This command will stop and remove all containers defined in the docker-compose.yml file and also remove any volumes associated with them.