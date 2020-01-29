const margin = 60;
const height = 550 - 2*margin;
const width = 960 - 2*margin;
const yScale = d3.scaleLinear();
const xScale = d3.scaleLinear();
const def_bincount = 10;

const properties = [
    {
        "name": "Scree Plot(R)",
        "property": "teaching",
        url: "/pca/scree/random",
        callbackfn: prepareLinePlot,
        x_label: "",
        y_label: "Eigen Values",
        title: "Scree plot with Random Sampling",
        active: true
    },
    {
        "name": "Scree Plot(S)",
        "property": "international",
        url: "/pca/scree/strat",
        callbackfn: prepareLinePlot,
        x_label: "",
        y_label: "Eigen Values",
        title: "Scree plot with Stratified Sampling"
    },
    {
        "name": "PCA Vectors 2D(R)",
        "property": "total_score",
        url: "/pca/top2/random",
        callbackfn: prepareScatterPlot,
        x_label: "Componenet 1",
        y_label: "Componenet 2",
        title: "PCA with Random Sampling"
    },
    {
        "name": "PCA Vectors 2D(S)",
        "property": "income",
        url: "/pca/top2/strat",
        callbackfn: prepareScatterPlot,
        x_label: "Componenet 1",
        y_label: "Componenet 2",
        title: "PCA with Stratified Sampling"
    },
    {
        "name": "MDS Euclidean (R)",
        "property": "research",
        url: "/mds/euclidean/random",
        callbackfn: prepareScatterPlot,
        x_label: "Componenet 1",
        y_label: "Componenet 2",
        title: "MDS with Euclidean Distance for Random Sampling"
    },
    {
        "name": "MDS Euclidean (S)",
        "property": "citations",
        url: "/mds/euclidean/strat",
        callbackfn: prepareScatterPlot,
        x_label: "Componenet 1",
        y_label: "Componenet 2",
        title: "MDS with Euclidean Distance for Stratified Sampling"
    },
    {
        "name": "MDS Correlation (R)",
        "property": "research2",
        url: "/mds/correlation/random",
        callbackfn: prepareScatterPlot,
        x_label: "Component 1",
        y_label: "Component 2",
        title: "MDS with Correlation Distance for Random Sampling"
    },
    {
        "name": "MDS Correlation (S)",
        "property": "citations2",
        url: "/mds/correlation/strat",
        callbackfn: prepareScatterPlot,
        x_label: "Component 1",
        y_label: "Component 2",
        title: "MDS with Correlation Distance for Stratified Sampling"
    },
    {
        "name": "Scatter Matrix (R)",
        "property": "num_students",
        url: "/scattermatrix/random",
        callbackfn: drawScatterMatrix,
        x_label: "",
        y_label: "",
        title: "Scatter Matrix of attributes with highest PCA loadings for Random Sampling"
    },
    {
        "name": "Scatter Matrix (S)",
        "property": "student_staff_ratio",
        url: "/scattermatrix/strat",
        callbackfn: drawScatterMatrix,
        x_label: "",
        y_label: "",
        title: "Scatter Matrix of attributes with highest PCA loadings for Stratified Sampling"
    },
];

const data_file = 'res/timesData.csv';
