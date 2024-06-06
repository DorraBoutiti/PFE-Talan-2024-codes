import numpy as np
import pandas as pd

from imblearn.over_sampling import RandomOverSampler

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import make_column_transformer
from sklearn.linear_model import LogisticRegression

import pickle

path = r"templates/data.csv"
df = pd.read_csv(path)

df.columns = df.columns.str.lower() #.str.replace(' ', '-')

df.drop('pk_employé', axis=1, inplace=True)
df['target'] = (df.situation == 'Sortie').astype(int)

X = df.iloc[:, :-1]
y = df["target"]
oversampler = RandomOverSampler(random_state=42)
X_resampled, y_resampled = oversampler.fit_resample(X, y)

data_resampled = pd.concat([pd.DataFrame(X_resampled, columns=X.columns), pd.Series(y_resampled, name='target')], axis=1)

df_full_train, df_test = train_test_split(data_resampled, test_size=0.2, random_state=1)
df_train, df_valid = train_test_split(df_full_train, test_size=0.2, random_state=1)

categorical = list(data_resampled.select_dtypes(include=['object']).columns)
numerical = list(data_resampled.select_dtypes(include=['number']).columns)

categorical.remove('situation')
categorical.remove('matricule')
numerical.remove('target')

def preprocess(df_train, df_valid, df_test, num, cat):
    ohe = OneHotEncoder(drop='first', handle_unknown='ignore')
    scaler = StandardScaler()

    transformer = make_column_transformer((scaler, num),
                                           (ohe, cat),
                                          remainder='passthrough',verbose_feature_names_out=False)
    X_train = transformer.fit_transform(df_train[cat+num])
    X_valid = transformer.transform(df_valid[cat+num])
    X_test = transformer.transform(df_test[cat+num])
    columns=transformer.get_feature_names_out()
   
    return X_train , X_valid, X_test, columns

numerical = ['age', 'heures de présence / jour', 'heures de présence / mois', 'note globale', 'montant du salaire']
categorical = ['code-unité organisationnelle', 'poste', "code-niveau d'expérience"]

X_train , X_valid, X_test, columns = preprocess(df_train, df_valid, df_test, numerical, categorical)
y_train = df_train['situation']
y_valid = df_valid['situation']
y_test = df_test['situation']

model_1 = LogisticRegression(solver='liblinear', random_state=1) #solver commet le model va s'entrîner ; il y a bcp des options / random_state = 1 sert à donner tjrs les mêmes résultats
model_1.fit(X_train, y_train)

result_test = df_test.copy()
result_test = result_test.drop(columns="target").copy()

result_test.insert(0, 'id_employé', result_test.index + 1)
result_test['Risque_de_depart'] = model_1.predict_proba(X_test)[:,1]

result_val = df_valid.copy()
result_val = result_val.drop(columns="target").copy()

result_val.insert(0, 'id_employé', result_val.index + 1)
result_val['Risque_de_depart'] = model_1.predict_proba(X_valid)[:,1]

result_train = df_train.copy()
result_train = result_train.drop(columns="target").copy()

result_train.insert(0, 'id_employé', result_train.index + 1)
result_train['Risque_de_depart'] = model_1.predict_proba(X_train)[:,1]

result = pd.concat([result_test, result_val, result_train])
result

result = result.drop_duplicates('matricule')
result = result[result['situation'] == 'Actif']
result.sort_values('Risque_de_depart', ascending=False)

result.to_csv('result2.csv', index=False)