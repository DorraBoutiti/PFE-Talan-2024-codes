import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import make_column_transformer
from sklearn.neighbors import KNeighborsRegressor

import pickle

path = r"data.csv"
df = pd.read_csv(path)

#df.columns = df.columns.str.lower().str.replace(' ', '_')
"""string_columns = list(df.dtypes[df.dtypes == 'object'].index)
for col in string_columns:
    df[col] = df[col].str.lower().str.replace(' ', '_')"""

df = df.drop('PK_Employé', axis=1)

df['log_salaire'] = np.log1p(df['Montant du salaire'])

categorical = list(df.select_dtypes(include=['object']).columns)
numerical = list(df.select_dtypes(include=['number']).columns)

categorical.remove('Matricule')
numerical.remove('Montant du salaire')
numerical.remove('log_salaire')

np.random.seed(2)

n = len(df) 

n_val = int(0.16 * n)
n_test = int(0.2 * n)
n_train = n - (n_val + n_test)

idx = np.arange(n)
np.random.shuffle(idx)
df_shuffled = df.iloc[idx]

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

k = 4
model = KNeighborsRegressor(n_neighbors=k)

model.fit(X_train, y_train)

with open('salary_prediction_model.pkl', 'wb') as f:
    pickle.dump(model, f)

result_test = df_test.copy()
result_test = result_test.drop(columns="log_salaire").copy()

result_test.insert(0, 'id_employé', result_test.index + 1)
result_test['salaire_estime'] = np.expm1(model.predict(X_test))
diff = result_test['salaire_estime'] - result_test['Montant du salaire']
result_test['augmentation_estimee_de_salaire'] = diff

result_val = df_val.copy()
result_val = result_val.drop(columns="log_salaire").copy()

result_val.insert(0, 'id_employé', result_val.index + 1)
result_val['salaire_estime'] = np.expm1(model.predict(X_val))
diff = result_val['salaire_estime'] - result_val['Montant du salaire']
result_val['augmentation_estimee_de_salaire'] = diff

result_train = df_train.copy()
result_train = result_train.drop(columns="log_salaire").copy()

result_train.insert(0, 'id_employé', result_train.index + 1)
result_train['salaire_estime'] = np.expm1(model.predict(X_train))
diff = result_train['salaire_estime'] - result_train['Montant du salaire']
result_train['augmentation_estimee_de_salaire'] = diff

result = pd.concat([result_test, result_val, result_train])
result


result.to_csv('result.csv', index=False)
#result.to_excel('result.xlsx', index=False)