'use client'
import React, { useState } from 'react';
import { Button } from "@nextui-org/button";
import AddTrainingModal from '../_components/AddTrainingModal';
import { api } from '~/trpc/react';


const Training = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);


  const { isFetching, data: allTraining, isLoading } = api.training.fetchAllTrainings.useQuery({
    userId: ""
  })


  return (
    <div className='w-screen h-screen bg-black p-4 text-white'>
      <Button onClick={() => setIsOpenModal(true)} size='sm' className='text-sm' >Add new Training</Button>


      <div className='mt-4'>
        {allTraining && allTraining.length > 0 ?

          <div className='border border-white border-opacity-20 rounded-2xl'>
            {allTraining.map((data: any) => {
              return (
                <h1 className='text-white text-lg border-t border-white border-opacity-20'>{data.trigger_word}</h1>
              )
            })}
          </div>
          : <div>
            <h1>No Trained Data Available</h1>
          </div>}
      </div>
      <AddTrainingModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
    </div>
  )
}

export default Training;