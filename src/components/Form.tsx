import { ChangeEvent, Dispatch, FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import { Activity } from "../types";
import { categories } from "../data/categories";
import { ActivityActions, ActivityState } from "../reducers/activity-reducer";

type FormProps = {
    dispatch: Dispatch<ActivityActions>,
    state: ActivityState
}

const emptyActivity: Activity = {
    calories: 0,
    category: 1,
    id: uuidv4(),
    name: ''
};

export default function Form({ dispatch, state }: FormProps) {

    const [activity, setActivity] = useState<Activity>(emptyActivity);

    useEffect(
        () => {
            if (state.activeId) {
                setActivity(state.activities.filter( x => x.id === state.activeId )[0]);
            }
        },
        [state.activeId]
    );

    const handleChange = (event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const isNumberField = ['category', 'calories'].includes(event.target.id);
        setActivity({
            ...activity,
            [event.target.id]: isNumberField ? +event.target.value : event.target.value
        });
    };

    const isValidActivity = () => {
        const { name, category, calories } = activity;
        return !!name.trim() && category > 0 && calories > 0;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch({ type: "save-activity", payload: { newActivity: activity } });
        setActivity({ ...emptyActivity, id: uuidv4() });
    };

    return (
        <form className="space-y-5 bg-white shadow p-10 rounded-lg" onSubmit={ handleSubmit }>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="category" className="font-bold">Categor&iacute;a</label>
                <select className="border border-slate-300 p-2 rounded-lg w-full bg-white" id="category" onChange={ handleChange }>
                    {
                        categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="name" className="font-bold">Actividad</label>
                <input className="border border-slate-300 p-2 rounded-lg"
                    id="name"
                    placeholder="Ej. Comida, Jugo de naranja, Ensalada, Ejercicios, Pesas, Bicicleta"
                    type="text"
                    value={activity.name}
                    onChange={ handleChange } />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories" className="font-bold">Calorias</label>
                <input className="border border-slate-300 p-2 rounded-lg"
                    id="calories"
                    placeholder="Ej. 300 o 500"
                    type="number"
                    value={activity.calories}
                    onChange={ handleChange } />
            </div>

            <input className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10 disabled:cursor-default"
                disabled={ !isValidActivity() }
                type="submit"
                value={ activity.category === 1 ? "Guardar Comida" : "Guardar Ejercicio" } />

        </form>
    );
}