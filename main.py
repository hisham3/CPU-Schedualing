import eel
import numpy as np
import json
from scheduling import (
    first_come_first_serve,
    shortest_job,
    longest_job,
    priority,
    round_robin,
    completion_time,
    turn_arround_time,
    waiting_time
)

func = {
    "first_come_first_serve": first_come_first_serve,
    "shortest_job": shortest_job,
    "longest_job": longest_job,
    "priority": priority,
    "round_robin": round_robin,
    "turn_arround_time": turn_arround_time,
    "waiting_time": waiting_time
}

def convert(o):
    if isinstance(o, np.int32): return int(o)
    if isinstance(o, np.float64): return float(o) 
    if isinstance(o, np.ndarray): return list(o)  
    raise TypeError

def remap_keys(mapping):
    return [{'key':k, 'value': v} for k, v in mapping.items()]

@eel.expose
def data(data_set):
    try:
        arrival, burst, priority_list = data_set.get("arrival"), data_set.get("burst"), data_set.get("priority")
        *processes_count, = range(1, len(arrival) + 1)

        if priority_list:
            arrival, processes_count, priority_list, burst = np.row_stack(list(zip(*sorted(zip(arrival, processes_count, priority_list, burst)))))
        else:
            arrival, processes_count, burst = np.row_stack(list(zip(*sorted(zip(arrival, processes_count, burst)))))
            
        gantt_chart = func[data_set.get("algorithm")](
                arrival,
                burst.copy(),
                processes_count,
                preemptive=data_set.get("algorithm_type") or None,
                priority=priority_list if isinstance(priority_list, np.ndarray) else None ,
                quantum=data_set.get("quantum") or None
            )

        completion = completion_time(gantt_chart, processes_count)

        processes_count, completion, arrival, burst = np.row_stack(list(zip(*sorted(zip(processes_count, completion, arrival, burst)))))
        result_eval = {
                "around_list": turn_arround_time(completion, arrival),
                "waiting_list": waiting_time(completion, arrival, burst),
                "around_avg": round(np.average(turn_arround_time(completion, arrival)), 2),
                "waiting_avg": round(np.average(waiting_time(completion, arrival, burst)), 2),
                "completion_list": completion
                }
        
    except Exception as e:
        print(e)
        return False
    
    return True, json.dumps(remap_keys(gantt_chart), default=convert), json.dumps(result_eval, default=convert)

eel.init('static')
eel.start('index.html')





