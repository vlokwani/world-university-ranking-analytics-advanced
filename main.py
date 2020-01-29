from flask import Flask, render_template
from util import *
import json

app = Flask(__name__, static_url_path='/static')

df = read_csv('./static/res/timesData.csv')
columns = list(df.columns)
df = cleanup(df)
df = convert_df(df)
data = fit_to_minmax_scaler(df)
clusters = get_all_kmeans_clusters(df)
elbow_idx = get_optimum_cluster_size_index(clusters, True)
opt_cluster = clusters[elbow_idx]
random_sample = get_random_sampling(data)
stratk_sample = get_k_stratified_fold(data, opt_cluster, splits=2)


def get_data_for_sample(sample):
    if sample == 'random':
        data = random_sample
    elif sample == 'strat':
        data = stratk_sample
    else:
        data = None
    return data


@app.route("/")
def hello():
    return render_template('index.html')


@app.route("/pca/scree/<sample>")
def pca_scree(sample):
    data = get_data_for_sample(sample)
    if not data:
        return render_template('404.html')

    ev = get_eigen_values(data)
    idx = get_optimized_knee_value(ev)
    retval = json.loads(pd.DataFrame(ev, columns=["Y"]).to_json())
    retval['knee'] = int(idx)
    return json.dumps(retval)


@app.route("/pca/top2/<sample>")
def pca_projection(sample):
    data = get_data_for_sample(sample)
    if not data:
        return render_template('404.html')

    data = project_into_two_pca_vectors(data)
    return pd.DataFrame(data, columns=['X', 'Y']).to_json()


@app.route("/scattermatrix/<sample>")
def scatter_matrix(sample):
    data = get_data_for_sample(sample)
    if not data:
        return render_template('404.html')

    ev = get_eigen_values(data)
    idx = get_optimized_knee_value(ev)

    loading_score = get_per_feature_pca_loading_scores(data, idx)
    top3features, idxs = get_top_three_features(data, loading_score)
    cols = [columns[idx] for idx in idxs]
    return pd.DataFrame(top3features, columns=cols).to_json()


@app.route("/mds/<distance>/<sample>")
def mds(distance, sample):
    # somehow calculate mds
    if distance == 'euclidean':
        pass
    elif distance == 'correlation':
        pass
    else:
        return render_template('404.html')

    data = get_data_for_sample(sample)
    if not data:
        return render_template('404.html')

    return pd.DataFrame(get_mds_data(data, distance), columns=['X', 'Y']).to_json()
