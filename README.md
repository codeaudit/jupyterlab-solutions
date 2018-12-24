# JupyterLab Solutions

A simple extension to hide solution cells in Jupyter Lab. Meant for teachers and students.

<p align="center">
<a href="https://notebooks.rmotr.com/fork/santiagobasulto/demonstration-of-jupyterlab-solutions-bcbbbdb9"><img src="https://user-images.githubusercontent.com/872296/50401412-30056380-076d-11e9-91d3-6bad93b540ef.png" width="170px"></a>
</p>

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
