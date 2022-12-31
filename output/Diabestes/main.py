import numpy as np
import sympy as sp
from sympy import pprint
from sympy.core.function import Function
from scipy.optimize import curve_fit
import matplotlib.pyplot as plt


def eq_solving(x,y):
    G0,A,t,a,w,o = sp.symbols('G0 A t a w o', real=True)
    G = sp.symbols('G', cls=Function)
    dt = G(t).diff(t)
    ddt = G(t).diff(t,2)

    equation = sp.Eq(ddt + 2*a*dt + ((w**2)+(a**2))*G(t), 0)
    solved = sp.dsolve(equation, G(t))
    C1,C2 = sp.symbols('C1 C2')
    solved_sub = solved.subs({C2:A*sp.cos((w*np.pi/180)*o), C1:A*sp.sin((w*np.pi/180)*o)}) # sin(t*w)*sin(o*w) + cos(t*w)*cos(o*w) == np.cos(w*(t-o))
    eq_g = G0 + solved_sub.rhs
    eq_general = sp.lambdify([t,G0,a,A,w,o], eq_g, np)

    return eq_general


def fitting(x,y):
    c, cov= curve_fit(eq_solving(x,y), x, y)

    return c


def plot(x_data1, x_data2,x_subs, y_data1, y_data2, y_subs1, y_subs2, diabetic):
    plt.ylim((0,max(list(y_data1)+list(y_data2))+70))
    plt.plot(x_subs, y_subs1, label='Has Not Diabetes')
    plt.scatter(x_data1, y_data1, marker='o', alpha=0.3)

    plt.plot(x_subs, y_subs2, label=f'Your Data ({diabetic})')
    plt.scatter(x_data2, y_data2, marker='o', alpha=0.3)

    plt.xlabel('t (hr)')
    plt.ylabel('Glucose (mg/dl)')
    plt.title('Modeling Diabetes')
    plt.legend()
    plt.savefig('./static/plot/last_fig.jpg')
    plt.close()
