import numpy as np

def first_come_first_serve(arrival_time, burst_time, processes_count, **kwargs):
    gantt = {}
    current_time = 0
    # enter if there is a burst process not finished
    while np.any(burst_time):
        
        if np.any(burst_time[arrival_time <= current_time]): # check the burst time for arrived process
            # finish the process
            filtered_burst = burst_time[arrival_time <= current_time]  # get only the arrived processes 
            first_burst = filtered_burst[filtered_burst != 0][0] # [2 3]
            gantt[(current_time, current_time + first_burst)] = processes_count[np.where(burst_time == first_burst)[0][0]] #append process block to the gantt chart [0 0 2 3] == 3 => [False False Flase True]
            burst_time[np.where(burst_time == first_burst)[0][0]] = 0 #finish the process
            current_time += first_burst  #update the current time
        else: # idle then go to the next time
            next_time = arrival_time[arrival_time > current_time][0]  # get the next process arrival time
            gantt[(current_time, next_time)] = None  # idle time for the CPU
            current_time = next_time

    return gantt

def shortest_job(arrival_time, burst_time, processes_count, preemptive=None, **kwargs):
    gantt = {}
    current_time = 0

    while np.any(burst_time):
        if np.any(burst_time[arrival_time <= current_time]): #return burst time of arrived process
            filtered_burst = burst_time[arrival_time <= current_time] #get only the arrived processes
            min_burst = np.min(filtered_burst[filtered_burst != 0]) #return the min burst time value
            start_time = current_time

            if preemptive: #for preemptive implementation only
                after_filtered_burst = burst_time[arrival_time <= (current_time + min_burst)]
                check = np.min(after_filtered_burst[after_filtered_burst != 0]) == min_burst

                if list(gantt.values())[-1: -2: -1] == [processes_count[np.where(burst_time == min_burst)[0][0]]]:  # [-1: -2: -1] get the last element without error out of range
                    last_key = list(gantt)[-1]
                    gantt.pop(last_key)
                    start_time = last_key[0]

                if not check:
                    next_time = arrival_time[arrival_time > current_time][0]

                    gantt[(start_time, next_time)] = processes_count[np.where(burst_time == min_burst)[0][0]]

                    burst_time[np.where(burst_time == min_burst)[0][0]] -= (next_time - current_time)
                    current_time = next_time
                    continue

            gantt[(start_time, current_time + min_burst)] = processes_count[np.where(burst_time == min_burst)[0][0]] #append process block to the gantt chart
            burst_time[np.where(burst_time == min_burst)[0][0]] = 0 #finish the process
            current_time += min_burst  #update the current time
        else:
            next_time = arrival_time[arrival_time > current_time][0] #get the next process arrival time
            gantt[(current_time, next_time)] = None #idle time for the CPU
            current_time = next_time

    return gantt

def longest_job(arrival_time, burst_time, processes_count, **kwargs):
    gantt = {}
    current_time = 0

    while np.any(burst_time):
        if np.any(burst_time[arrival_time <= current_time]): #return burst time of arrived process
            filtered_burst = burst_time[arrival_time <= current_time] #get only the arrived processes
            max_burst = np.max(filtered_burst[filtered_burst != 0]) #return the min burst time value

            gantt[(current_time, current_time + max_burst)] = processes_count[np.where(burst_time == max_burst)[0][0]] #append process block to the gantt chart
            burst_time[np.where(burst_time == max_burst)[0][0]] = 0 #finish the process
            current_time += max_burst  #update the current time
        else:
            next_time = arrival_time[arrival_time > current_time][0] #get the next process arrival time
            gantt[(current_time, next_time)] = None #idle time for the CPU
            current_time = next_time

    return gantt

def priority(arrival_time, burst_time, processes_count, priority=None, **kwargs):
    gantt = {}
    current_time = 0

    while np.any(burst_time):
        if np.any(burst_time[arrival_time <= current_time]): #return burst time of arrived process
            filtered_burst = np.logical_and(arrival_time <= current_time, burst_time != 0) #get only the arrived processes
            priority_processes = priority[filtered_burst] #get only the arrived processes
            priority_index = np.where(np.logical_and(priority == np.min(priority_processes), burst_time != 0))[0][0] #return the min burst time value

            gantt[(current_time, current_time + burst_time[priority_index])] = processes_count[priority_index]  # append process block to the gantt chart
            current_time += burst_time[priority_index]  # update the current time
            burst_time[priority_index] = 0  # finish the process
        else:
            next_time = arrival_time[arrival_time > current_time][0]  # get the next process arrival time
            gantt[(current_time, next_time)] = None  # idle time for the CPU
            current_time = next_time

    return gantt

def round_robin(arrival_time, burst_time, processes_count, quantum=None, **kwargs):
    gantt = {}
    current_time = 0

    while np.any(burst_time):

        if np.any(burst_time[arrival_time <= current_time]):
            filtered_burst = burst_time[arrival_time <= current_time]  # get only the arrived processes
            first_burst = filtered_burst[filtered_burst != 0][0]
            burst_index = np.where(burst_time == first_burst)[0][0]

            if first_burst <= quantum:
                gantt[(current_time, current_time + first_burst)] = processes_count[burst_index] #append process block to the gantt chart
                burst_time[burst_index] = 0 #finish the process
                current_time += first_burst  #update the current time # 
            else:
                first_burst -= quantum # 4 => q3
                gantt[(current_time, current_time + quantum)] = processes_count[burst_index]  # append process block to the gantt chart
                burst_time[burst_index] = first_burst  # finish the process
                current_time += quantum  # update the current time

                # CLS => circular left shift for the unfinished process
                filtered_burst = burst_time[arrival_time <= current_time] #after executed the process
                arrival_time, burst_time, processes_count = circular_shift(arrival_time, burst_time, processes_count, current_index=burst_index, insert_index=len(filtered_burst) - 1)
        else:
            next_time = arrival_time[arrival_time > current_time][0] #get the next process arrival time
            gantt[(current_time, next_time)] = None #idle time for the CPU
            current_time = next_time

    return gantt

def circular_shift(*arr, current_index=0, insert_index=-1):
    *combined, = zip(*arr)
    combined.insert(insert_index, combined.pop(current_index))
    return np.column_stack([*combined])

def completion_time(gantt, processes_count):
    completion = {process: completion_time[1] for completion_time, process in gantt.items()}
    return np.array([completion[process] for process in processes_count])

def turn_arround_time(completion, arrival):
    return completion - arrival

def waiting_time(completion, arrival, burst):
    return (completion - arrival) - burst