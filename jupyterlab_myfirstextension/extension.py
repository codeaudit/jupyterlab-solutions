import json
from notebook.base.handlers import IPythonHandler
from notebook.utils import url_path_join


class GraderHandler(IPythonHandler):
    def initialize(self, test_variable=None):
        self.test_variable = test_variable

    def get(self):
        self.finish(json.dumps({'test_variable': self.test_variable or ''}))


def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.
    Args:
        nb_server_app (NotebookWebApplication): handle to the Notebook webserver instance.
    """
    web_app = nb_server_app.web_app
    test_variable = nb_server_app.config.get('JupyterLabCustomConfig', {}).get('testVariable', [])

    host_pattern = '.*$'
    base_url = web_app.settings['base_url']

    print('>>>>>>> Installing jupyterlab_grader handler on path %s' % url_path_join(base_url, 'grader'))
    print('>>>>>>> Test variable: %s' % test_variable)

    web_app.add_handlers(host_pattern, [(url_path_join(base_url, 'grader'), GraderHandler, {'test_variable': test_variable})])
