import React, { useState } from 'react'
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent } from "@nextui-org/modal";
import { api } from '~/trpc/react';

const AddTrainingModal = ({ setIsOpenModal, isOpenModal }: { setIsOpenModal: (val: boolean) => void, isOpenModal: boolean }) => {

    const [isLoading, setIsLoading] = useState(false);

    const { mutate: handleAddTraining } = api.training.addNewTraining.useMutation()

    const [zipUrl, setZipUrl] = useState('');
    const [steps, setSteps] = useState('');
    const [learning_rate, setLearningRate] = useState('');
    const [trigger_word, setTriggerWord] = useState('');
    const [sample_prompt, setSamplePrompt] = useState("");
    const [rank, setRank] = useState('');
    const [hf_model_path, setHfModelPath] = useState('');
    const [weight_link, setWeightLink] = useState('');
    const [configFile_url, setConfigFileUrl] = useState('');


    const handleAdd = async () => {
        setIsLoading(true);
        try {
            const response = handleAddTraining({
                steps,
                userId: 'unstudio-rgoh6f',
                configFile_url,
                weight_link,
                rank,
                hf_model_path,
                sample_prompt,
                trigger_word,
                learning_rate,
                zip_url: zipUrl,
            })

            console.log(response)
        } catch (err) {
            console.log("Error in adding training in db")
        }

        handleCancel();
        setIsLoading(false);
    }


    const handleCancel = () => {
        setZipUrl('');
        setSteps('');
        setLearningRate('');
        setTriggerWord('');
        setSamplePrompt("");
        setRank('');
        setHfModelPath('');
        setWeightLink('');
        setConfigFileUrl('');
        setIsOpenModal(false)
    }
    return (
        <Modal size='2xl' isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}  >
            <ModalContent className='p-4 bg-gray-400'>
                <div>
                    <h1 className='mb-2'>Enter new Training Details</h1>
                    <div className='grid grid-cols-2 gap-4'>
                        <Input label="ZipUrl" placeholder="Enter zip url" value={zipUrl} onChange={(e) => setZipUrl(e.target.value)} />
                        <Input label="Steps" placeholder="Enter steps" value={steps} onChange={(e) => setSteps(e.target.value)} />
                        <Input label="Learning Rate" placeholder="Enter learning rate" value={learning_rate} onChange={(e) => setLearningRate(e.target.value)} />
                        <Input label="Trigger Word" placeholder="Enter trigger word" value={trigger_word} onChange={(e) => setTriggerWord(e.target.value)} />
                        <Input label="Sample Prompt" placeholder="Enter sample prompt" value={sample_prompt} onChange={(e) => setSamplePrompt(e.target.value)} />
                        <Input label="Rank" placeholder="Enter rank" value={rank} onChange={(e) => setRank(e.target.value)} />
                        <Input label="HF Model Path" placeholder="Enter HF model path" value={hf_model_path} onChange={(e) => setHfModelPath(e.target.value)} />
                        <Input label="Weight Link" placeholder="Enter weight link" value={weight_link} onChange={(e) => setWeightLink(e.target.value)} />
                        <Input label="Config File URL" placeholder="Enter config file URL" value={configFile_url} onChange={(e) => setConfigFileUrl(e.target.value)} />
                    </div>

                    <div className='flex items-center gap-4 mt-2 justify-end'>
                        <Button onClick={handleCancel} size='sm'>Cancel</Button>
                        <Button isLoading={isLoading} onClick={handleAdd} size='sm' className='bg-green-400'>Add</Button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    )
}

export default AddTrainingModal