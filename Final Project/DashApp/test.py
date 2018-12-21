import dash
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
import plotly.plotly as py
import plotly.graph_objs as go

external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)


app.title = '2015 US Flight Delay'


df = pd.read_csv(
'https://raw.githubusercontent.com/czhu505/Data608/master/Final%20Project/data/flight_clean.csv')


app.layout = html.Div([
    dcc.Graph(id='graph-with-slider'),
    dcc.Slider(
        id='month-slider',
        min=df['MONTH'].min(),
        max=df['MONTH'].max(),
        value=df['MONTH'].min(),
        marks={str(MONTH): str(MONTH) for MONTH in df['MONTH'].unique()}
    )
])

@app.callback(
    dash.dependencies.Output('graph-with-slider', 'figure'),
    [dash.dependencies.Input('month-slider', 'value')])

def update_figure(selected_month):
    filtered_df = df[df.MONTH == selected_month]
    traces = []
    for i in filtered_df.AIRLINE.unique():
        df_by_continent = filtered_df[filtered_df['AIRLINE'] == i]
        traces.append(go.Scatter(
            x=df_by_continent['DISTANCE'],
            y=df_by_continent['ARRIVAL_DELAY'],
            text=df_by_continent['AIRLINE'],
            mode='markers',
            opacity=0.7,
            marker={
                'size': 5,
                'line': {'width': 0.5, 'color': 'white'}
            },
            name=i
        ))

    return {
        'data': traces,
        'layout': go.Layout(
            xaxis={'type': 'log', 'title': 'Monthly Delay by Airline in  2015'},
            yaxis={'title': 'ARRIVAL_DELAY in Minutes', 'range': [-15, 15]},
            margin={'l': 40, 'b': 40, 't': 10, 'r': 10},
            legend={'x': 0, 'y': 1},
            hovermode='closest'
        )
    }


if __name__ == '__main__':
    app.run_server(debug=True)
