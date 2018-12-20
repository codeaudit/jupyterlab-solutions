# jupyterlab-rmotr-solutions

My first extension description


## Installation

To install using pip:

```bash
jupyter labextension install @rmotr/jupyterlab-solutions
pip install jupyterlab-solutions
jupyter serverextension enable jupyterlab_rmotr_solutions
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
      "jupyterlab_rmotr_solutions": true
    }
  }
}
```
on `/Users/<USERNAME>/.jupyter/jupyter_notebook_config.json`.

## Adding custom variables

Add the following to `/Users/<USERNAME>/.jupyter/jupyter_notebook_config.py`.
```
c.JupyterLabRmotrSolutions.is_enabled = True
c.JupyterLabRmotrSolutions.role = 'teacher'
```
