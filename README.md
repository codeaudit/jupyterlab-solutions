# jupyterlab_myfirstextension

My first extension description


## Prerequisites

* JupyterLab

## Installation

To install using pip:

```bash
jupyter labextension install jupyterlab_myfirstextension
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
jupyter labextension link .
```

also add 
```javascript
{
  "NotebookApp": {
    "nbserver_extensions": {
      "jupyter_nbextensions_configurator": true,
      "jupyterlab_myfirstextension.extension": true
    }
  }
}
```
on `/Users/<USERNAME>/.jupyter/jupyter_notebook_config.json`.

## Adding custom variables
Add the following to `/Users/<USERNAME>/.jupyter/jupyter_notebook_config.py`.

```
c.JupyterLabIFrame.MY_VARIABLE = 'MY_VALUE'
```