# -*- coding: utf-8 -*-
import os

LABEL_B1_FILEPATH = './labels/b1_items/'
LABEL_OTHER_FILEPATH = './labels/other_items/'
LABEL_JSON_FILEPATH = './labels/labels.json'
SAMPLE_FILEPATH = './samples/'

LABEL_IMG_URL = os.environ.get('LABEL_IMG_URL', 'http://locahost:8080/labels/')
CNN_BACKBONE = os.environ.get('CNN_BACKBONE', 'Inception' ) # Densenet, Efficientnet
THRESHOLD_SIMILAR = float(os.environ.get('THRESHOLD_SIMILAR', 0.65 ))
THRESHOLD_NUM_SIMILAR = int(os.environ.get('THRESHOLD_NUM_SIMILAR', 3 ))

MULTI_PROCESSES_MODE = os.environ.get('MULTI_PROCESSES_MODE', False)
NUM_PROCESSES = int(os.environ.get('NUM_PROCESSES', 2 ))
