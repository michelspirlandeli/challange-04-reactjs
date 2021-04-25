import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

type TFood = {
  id:number;
  name:string;
  description:string;
  price:number;
  available: boolean;
  image:string;
}

type TFormProps = {
  image: string
  name: string
  price: string
  description: string
}

const Dashboard = () =>{

  const [foods, setFoods] = useState<TFood[]>([])
  const [editingFood, setEditingFood] = useState<TFood>({} as TFood)
  const [modalOpen, setModalOpen] = useState(Boolean)
  const [editModalOpen, setEditModalOpen] = useState(Boolean)

  useEffect( () => {
    const fetchData = async () => {
      const response = await api.get<TFood[]>('/foods');
      setFoods(response.data)
    }
    fetchData()
  }, [])

  const handleAddFood = async (food:TFormProps): Promise<void> => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }
  
  const handleUpdateFood = async (food: TFormProps): Promise<void> => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated:TFood[] = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }  

  const handleDeleteFood = async (id: number): Promise<void> => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered:TFood[] = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }  

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  } 
  
  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)
  }  

  const handleEditFood = (food: TFood) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }  

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );  
}

export default Dashboard;