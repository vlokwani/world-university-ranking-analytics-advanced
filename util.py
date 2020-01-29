import random
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans
from sklearn.model_selection import StratifiedKFold as skf
from sklearn.decomposition import PCA
from matplotlib import pyplot as plt
from sklearn import manifold
from sklearn.metrics import pairwise_distances


def read_csv(csvfile):
    return pd.read_csv(csvfile)


def cleanup(df):
    top_countries = df.country.value_counts()[:5]
    df = df[df.country.apply(lambda x: x in top_countries)]

    columns_to_drop = ['university_name', 'world_rank', 'country', 'year']
    df.drop(columns_to_drop, axis=1, inplace=True)
    df.dropna(inplace=True)
    return df


def convert_df(df):
    def get_ratio(m):
        l = list(m)
        return l[0] * 1.0 / l[1]

    def convert(val):
        return np.nan if val == '-' else val

    df['num_students'] = df.num_students.astype(str).apply(lambda x: np.int64("".join(x.split(','))))
    df['fmr'] = df.female_male_ratio.astype(str).apply(lambda x: get_ratio(map(np.int64, x.split(":"))))
    df['international'] = df.international.apply(convert).astype(float)
    df['income'] = df.income.apply(convert).astype(float)
    df['total_score'] = df.total_score.apply(convert).astype(float)
    df.dropna(inplace=True)
    df.drop('female_male_ratio', axis=1, inplace=True)
    df = df.reset_index()
    df.drop('index', axis=1, inplace=True)

    return df


def fit_to_minmax_scaler(df):
    mms = MinMaxScaler()
    mms.fit(df)
    df_scaled = mms.transform(df)
    return df_scaled


def get_optimized_knee_value(values):
    n_points = len(values)
    all_coord = np.vstack((range(n_points), values)).T
    first_point = all_coord[0]
    line_vec = all_coord[-1] - all_coord[0]
    line_vec_norm = line_vec / np.sqrt(np.sum(line_vec**2))
    vec_from_first = all_coord - first_point
    scalar_product = np.sum(vec_from_first * np.matlib.repmat(line_vec_norm, n_points, 1), axis=1)
    vec_from_first_parallel = np.outer(scalar_product, line_vec_norm)
    vec_to_line = vec_from_first - vec_from_first_parallel
    dist_to_line = np.sqrt(np.sum(vec_to_line ** 2, axis=1))
    idx_of_best_point = np.argmax(dist_to_line)
    print(idx_of_best_point)
    return idx_of_best_point


def get_all_kmeans_clusters(data, max_clusters=15):
    clus_obj = map(lambda n: KMeans(n_clusters=n), range(1, max_clusters + 1))
    return [clus.fit(data) for clus in clus_obj]


def get_optimum_cluster_size_index(clusters, plot=False):
    sse = [clus.inertia_ for clus in clusters]
    elbow_idx = get_optimized_knee_value(sse)

    if plot:
        scatter_plot_opts = {'s': 200, 'facecolors': 'none', 'edgecolors': 'r'}
        plt.plot(range(1, 16), sse, 'go-')
        plt.scatter(elbow_idx + 1, sse[elbow_idx], **scatter_plot_opts)

    return elbow_idx


def get_random_sampling(data, scale=0.5):
    size = int(data.shape[0] * scale)
    return random.sample(list(data), size)


def get_k_stratified_fold(data, cluster, splits=2):
    skfold = skf(n_splits=splits)
    train, test = list(), list()
    for train_index, test_index in skfold.split(data, cluster.labels_):
        train.append(train_index)
        test.append(test_index)
    sample = train[0]
    return [data[idx] for idx in sample]


def fit_pca(data, n_comp=None):
    pca = PCA(n_components=n_comp)
    pca.fit(data)
    return pca

def get_eigen_values(data):
    pca = fit_pca(data)
    return pca.explained_variance_


def get_cumulative_sum(eigen_values):
    return np.cumsum(eigen_values)


def get_per_feature_pca_loading_scores(data, idx):
    pca = fit_pca(data, n_comp=idx + 1)
    comp = pca.components_
    return list(map(sum, map(lambda tup: [x ** 2 for x in tup], zip(*comp))))


def get_top_three_features(data, loading_score):
    attr_idxs = np.argsort(loading_score)[-3:]
    return get_feature_data(attr_idxs, data), attr_idxs


def get_feature_data(attr_idxs, data):
    return [[d[idx] for idx in attr_idxs] for d in data]


def project_into_two_pca_vectors(data):
    return fit_pca(data, 2).transform(data)


def get_mds_data(data, distance_metric):
    data = fit_pca(data, n_comp=3).transform(data)
    mds = manifold.MDS(n_components=2, dissimilarity='precomputed')
    distance = pairwise_distances(data, metric=distance_metric)
    return mds.fit_transform(distance)