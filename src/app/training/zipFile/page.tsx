'use client'
import React, { useEffect, useState, useRef } from 'react';
import JSZip from 'jszip';

function ZipImageViewer() {
    const [images, setImages] = useState([]);
    const urlsRef = useRef([]);

    useEffect(() => {
        let isMounted = true;

        async function fetchAndUnzip() {
            try {
                // Fetch the ZIP file as a blob
                const response = await fetch('https://lora-training-datasets.s3.us-east-1.amazonaws.com/orange-tree/Kiko_Comfy_Chair.zip');
                const blob = await response.blob();

                // Load the ZIP file using JSZip
                const zip = await JSZip.loadAsync(blob);

                // Filter out files that are images based on their extension
                const imageFiles = Object.keys(zip.files).filter((filename) =>
                    /\.(png|jpe?g|gif|bmp|svg)$/i.test(filename) && !filename.includes('MACOSX')
                );

                // Extract images and create object URLs
                const imagePromises = imageFiles.map(async (filename) => {
                    const fileData = await zip.file(filename).async('blob');
                    const url = URL.createObjectURL(fileData);
                    urlsRef.current.push(url); // Keep track of URLs to revoke later
                    return { filename, url };
                });

                const images = await Promise.all(imagePromises);
                if (isMounted) {
                    setImages(images);
                }
            } catch (error) {
                console.error('Error fetching or unzipping the file:', error);
            }
        }

        fetchAndUnzip();

    }, []);

    return (
        <div>
            <div className='grid grid-cols-4 w-[95%] gap-4 mx-auto'>
            {images.map((img) => (
                <div key={img.filename}>
                    <img src={img.url} alt={img.filename} className='object-contain' style={{ maxWidth: '100%' }} />
                </div>
            ))}
            </div>
        </div>
    );
}

export default ZipImageViewer;
