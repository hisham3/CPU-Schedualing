import eel
# import numpy as np

@eel.expose
def data(data_set):
    try:
        print(data_set)
    except Exception as e:
        print(e)
        return False
    return True

eel.init('static')
eel.start('index.html')





