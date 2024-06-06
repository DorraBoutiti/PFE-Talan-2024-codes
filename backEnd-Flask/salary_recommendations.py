# Importation des modules nécessaires
from flask import Flask, jsonify, Blueprint
import pickle
import numpy as np
import pandas as pd
import csv
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import make_column_transformer
from sqlalchemy import create_engine

salary_recommendations = Flask(__name__)

salary_recommendations_bp = Blueprint('salary_recommendations', __name__)

model = pickle.load(open('salary_prediction_model.pkl', 'rb'))
engine = create_engine('mysql://root:root@127.0.0.1:3307/smart_compensation_db')

@salary_recommendations_bp.route('/api/employees', methods=['GET'])
def get_employees_with_predicted_salaries():
    query = "SELECT * FROM employees"
    employees_df = pd.read_sql(query, engine)

    employees_df['log_salaire'] = np.log1p(employees_df['Montant du salaire'])

    categorical = list(employees_df.select_dtypes(include=['object']).columns)
    numerical = list(employees_df.select_dtypes(include=['number']).columns)

    np.random.seed(2)

    n = len(employees_df) 

    n_val = int(0.16 * n)
    n_test = int(0.2 * n)
    n_train = n - (n_val + n_test)

    idx = np.arange(n)
    np.random.shuffle(idx)
    df_shuffled = employees_df.iloc[idx]

    df_train = df_shuffled.iloc[:n_train].copy()
    df_val = df_shuffled.iloc[n_train:n_train+n_val].copy()
    df_test = df_shuffled.iloc[n_train+n_val:].copy()

    y_train = df_train.log_salaire.values
    y_val = df_val.log_salaire.values
    y_test = df_test.log_salaire.values

    numerical = ['Heures de présence / mois', 'expérience en année', 'Age', 'note globale', 'taux_absenteisme']
    categorical = ['Droits Congés Payés', 'poste', 'classification', 'Code-Qualification', 'département', 'Ville de naissance', 'unité organisationnelle', 'Type travail']

    def preprocess(df_train, df_valid, df_test, num, cat):
        ohe = OneHotEncoder(drop='first', handle_unknown='ignore')
        scaler = StandardScaler()

        transformer = make_column_transformer((scaler, num),
                                            (ohe, cat),
                                            remainder='passthrough', verbose_feature_names_out=False)
        X_train = transformer.fit_transform(df_train[cat + num])
        X_valid = transformer.transform(df_valid[cat + num])
        X_test = transformer.transform(df_test[cat + num])
        columns = transformer.get_feature_names_out()
    
        return X_train , X_valid, X_test, columns

    X_train , X_val, X_test, columns = preprocess(df_train, df_val, df_test, numerical, categorical)

    numerical = ['Heures de présence / mois', 'expérience en année', 'Age', 'note globale', 'taux_absenteisme']
    categorical = ['Droits Congés Payés', 'poste', 'classification', 'Code-Qualification', 'département', 'Ville de naissance', 'unité organisationnelle', 'Type travail']

    result_test = df_test.copy()
    result_test = result_test.drop(columns="log_salaire").copy()

    result_test.insert(0, 'id_employé', result_test.index + 1)
    result_test['new base salary'] = np.expm1(model.predict(X_test))
    diff = result_test['new base salary'] - result_test['Montant du salaire']
    result_test['recommanded increase (amount)'] = diff
    result_test['recommanded increase (%)'] = diff / result_test['Montant du salaire'] * 100

    result_val = df_val.copy()
    result_val = result_val.drop(columns="log_salaire").copy()

    result_val.insert(0, 'id_employé', result_val.index + 1)
    result_val['new base salary'] = np.expm1(model.predict(X_val))
    diff = result_val['new base salary'] - result_val['Montant du salaire']
    result_val['recommanded increase (amount)'] = diff
    result_val['recommanded increase (%)'] = diff / result_val['Montant du salaire'] * 100

    result_train = df_train.copy()
    result_train = result_train.drop(columns="log_salaire").copy()

    result_train.insert(0, 'id_employé', result_train.index + 1)
    result_train['new base salary'] = np.expm1(model.predict(X_train))
    diff = result_train['new base salary'] - result_train['Montant du salaire']
    result_train['recommanded increase (amount)'] = diff
    result_train['recommanded increase (%)'] = diff / result_train['Montant du salaire'] * 100

    result = pd.concat([result_test, result_val, result_train])
    result
    employees_df = result.iloc[:100]
    employees_with_salaries = employees_df.to_dict(orient='records')
    return jsonify(employees_with_salaries)

@salary_recommendations_bp.route('/api/employees/need', methods=['GET'])
def get_employees_with_predicted_salaries_need():
    query = "SELECT * FROM employees"
    employees_df = pd.read_sql(query, engine)

    employees_df['log_salaire'] = np.log1p(employees_df['Montant du salaire'])

    categorical = list(employees_df.select_dtypes(include=['object']).columns)
    numerical = list(employees_df.select_dtypes(include=['number']).columns)

    np.random.seed(2)

    n = len(employees_df) 

    n_val = int(0.16 * n)
    n_test = int(0.2 * n)
    n_train = n - (n_val + n_test)

    idx = np.arange(n)
    np.random.shuffle(idx)
    df_shuffled = employees_df.iloc[idx]

    df_train = df_shuffled.iloc[:n_train].copy()
    df_val = df_shuffled.iloc[n_train:n_train+n_val].copy()
    df_test = df_shuffled.iloc[n_train+n_val:].copy()

    y_train = df_train.log_salaire.values
    y_val = df_val.log_salaire.values
    y_test = df_test.log_salaire.values

    numerical = ['Heures de présence / mois', 'expérience en année', 'Age', 'note globale', 'taux_absenteisme']
    categorical = ['Droits Congés Payés', 'poste', 'classification', 'Code-Qualification', 'département', 'Ville de naissance', 'unité organisationnelle', 'Type travail']

    def preprocess(df_train, df_valid, df_test, num, cat):
        ohe = OneHotEncoder(drop='first', handle_unknown='ignore')
        scaler = StandardScaler()

        transformer = make_column_transformer((scaler, num),
                                            (ohe, cat),
                                            remainder='passthrough', verbose_feature_names_out=False)
        X_train = transformer.fit_transform(df_train[cat + num])
        X_valid = transformer.transform(df_valid[cat + num])
        X_test = transformer.transform(df_test[cat + num])
        columns = transformer.get_feature_names_out()
    
        return X_train , X_valid, X_test, columns

    X_train , X_val, X_test, columns = preprocess(df_train, df_val, df_test, numerical, categorical)

    numerical = ['Heures de présence / mois', 'expérience en année', 'Age', 'note globale', 'taux_absenteisme']
    categorical = ['Droits Congés Payés', 'poste', 'classification', 'Code-Qualification', 'département', 'Ville de naissance', 'unité organisationnelle', 'Type travail']

    result_test = df_test.copy()
    result_test = result_test.drop(columns="log_salaire").copy()

    result_test.insert(0, 'id_employé', result_test.index + 1)
    result_test['new base salary'] = np.expm1(model.predict(X_test))
    diff = result_test['new base salary'] - result_test['Montant du salaire']
    result_test['recommanded increase (amount)'] = diff
    result_test['recommanded increase (%)'] = diff / result_test['Montant du salaire'] * 100

    result_val = df_val.copy()
    result_val = result_val.drop(columns="log_salaire").copy()

    result_val.insert(0, 'id_employé', result_val.index + 1)
    result_val['new base salary'] = np.expm1(model.predict(X_val))
    diff = result_val['new base salary'] - result_val['Montant du salaire']
    result_val['recommanded increase (amount)'] = diff
    result_val['recommanded increase (%)'] = diff / result_val['Montant du salaire'] * 100

    result_train = df_train.copy()
    result_train = result_train.drop(columns="log_salaire").copy()

    result_train.insert(0, 'id_employé', result_train.index + 1)
    result_train['new base salary'] = np.expm1(model.predict(X_train))
    diff = result_train['new base salary'] - result_train['Montant du salaire']
    result_train['recommanded increase (amount)'] = diff
    result_train['recommanded increase (%)'] = diff / result_train['Montant du salaire'] * 100

    result = pd.concat([result_test, result_val, result_train])
    result = result[result['recommanded increase (%)'] > 0]
    
    employees_df = result.iloc[:100]

    employees_with_salaries = employees_df.to_dict(orient='records')
    return jsonify(employees_with_salaries)

path = r'result2.csv'

@salary_recommendations_bp.route('/api/churn-risk', methods=['GET'])
def get_result():
    try:
        with open(path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            employees = [row for index, row in enumerate(reader)]

        employees.sort(key=lambda x: float(x['Risque_de_depart']), reverse=True)

        return jsonify(employees)
    except FileNotFoundError:
        return jsonify({'error': 'Fichier CSV non trouvé'}), 404
    except ValueError:
        return jsonify({'error': 'Erreur de conversion des données CSV'}), 500

    try:
        with open(path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            employees = [row for index, row in enumerate(reader)]

        business_units = {}
        for employee in employees:
            unit_code = employee['code-unité organisationnelle']
            risk_score = float(employee['Risque_de_depart'])

            if unit_code not in business_units:
                business_units[unit_code] = {
                    'nb_employes': 0,
                    'nb_high_risk_employees': 0,
                    'risk_distribution': [0, 0, 0]
                }
            
            business_units[unit_code]['nb_employes'] += 1
            if risk_score > 0.75:
                business_units[unit_code]['nb_high_risk_employees'] += 1
            
            if risk_score <= 0.49:
                business_units[unit_code]['risk_distribution'][0] += 1
            elif risk_score <= 0.74:
                business_units[unit_code]['risk_distribution'][1] += 1
            else:
                business_units[unit_code]['risk_distribution'][2] += 1

        result = []
        for unit_code, data in business_units.items():
            nb_employes = data['nb_employes']
            nb_high_risk_employees = data['nb_high_risk_employees']
            percent_high_risk = (nb_high_risk_employees / nb_employes) * 100 if nb_employes > 0 else 0
            risk_distribution_percent = [
                (count / nb_employes) * 100 if nb_employes > 0 else 0
                for count in data['risk_distribution']
            ]

            result.append({
                'code_unité_organisationnelle': unit_code,
                'nb_employes': nb_employes,
                'nb_high_risk_employees': nb_high_risk_employees,
                'percent_high_risk': percent_high_risk,
                'risk_distribution_percent': risk_distribution_percent
            })
        result = sorted(result, key=lambda x: x['percent_high_risk'], reverse=True)
        return jsonify(result)

    except FileNotFoundError:
        return jsonify({'error': 'Fichier CSV non trouvé'}), 404
    except ValueError as e:
        return jsonify({'error': f'Erreur de conversion des données CSV: {str(e)}'}), 500

@salary_recommendations_bp.route('/api/churn-risk/business-unit', methods=['GET'])
def get_result_2():
    try:
        with open(path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            employees = [row for index, row in enumerate(reader)]

        business_units = {}
        for employee in employees:
            unit_code = employee['code-unité organisationnelle']
            risk_score = float(employee['Risque_de_depart'])

            if unit_code not in business_units:
                business_units[unit_code] = {
                    'nb_employes': 0,
                    'nb_high_risk_employees': 0,
                    'risk_distribution': [0, 0, 0]
                }
            
            business_units[unit_code]['nb_employes'] += 1
            if risk_score > 0.75:
                business_units[unit_code]['nb_high_risk_employees'] += 1
            
            if risk_score <= 0.49:
                business_units[unit_code]['risk_distribution'][0] += 1
            elif risk_score <= 0.74:
                business_units[unit_code]['risk_distribution'][1] += 1
            else:
                business_units[unit_code]['risk_distribution'][2] += 1

        result = []
        for unit_code, data in business_units.items():
            nb_employes = data['nb_employes']
            nb_high_risk_employees = data['nb_high_risk_employees']
            percent_high_risk = round((nb_high_risk_employees / nb_employes) * 100, 2) if nb_employes > 0 else 0
            risk_distribution_percent = [
                round((count / nb_employes) * 100, 2) if nb_employes > 0 else 0
                for count in data['risk_distribution']
            ]

            result.append({
                'code_unité_organisationnelle': unit_code,
                'nb_employes': nb_employes,
                'nb_high_risk_employees': nb_high_risk_employees,
                'percent_high_risk': percent_high_risk,
                'risk_distribution_percent': risk_distribution_percent
            })

        # Trier les résultats par pourcentage de risque élevé de manière décroissante
        result = sorted(result, key=lambda x: x['percent_high_risk'], reverse=True)

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
  
if __name__ == '__main__':
    salary_recommendations.run(debug=True)