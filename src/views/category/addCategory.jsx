import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { db } from '../../firebaseConfig/firebase'
import { collection, addDoc } from 'firebase/firestore'

const AddCategory = () => {
  const [categoryData, setCategoryData] = useState({
    categoryName: '',
    categoryDescription: '',
    categoryImage: null,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setCategoryData({ ...categoryData, [id]: value })
  }

  // Handle file input change (convert image to Base64)
  const handleFileChange = (e) => {
    const { files } = e.target
    if (files && files[0]) {
      const file = files[0]
      // Convert the image to Base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setCategoryData({ ...categoryData, categoryImage: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!categoryData.categoryImage) {
      setError('Please upload a category image.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Save category data to Firestore
      const categoriesCollection = collection(db, 'categories')
      await addDoc(categoriesCollection, {
        categoryName: categoryData.categoryName,
        categoryDescription: categoryData.categoryDescription,
        categoryImage: categoryData.categoryImage, // Storing the Base64 image string
      })

      // Reset form data
      setCategoryData({
        categoryName: '',
        categoryDescription: '',
        categoryImage: null,
      })
      alert('Category added successfully!')
    } catch (err) {
      console.error('Error adding category:', err)
      setError('Failed to add category.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Category</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="categoryName">Category Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="categoryName"
                  placeholder="Enter category name"
                  value={categoryData.categoryName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="categoryDescription">Category Description</CFormLabel>
                <CFormTextarea
                  id="categoryDescription"
                  rows={3}
                  placeholder="Enter category description"
                  value={categoryData.categoryDescription}
                  onChange={handleInputChange}
                  required
                ></CFormTextarea>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="categoryImage">Category Image</CFormLabel>
                <CFormInput
                  type="file"
                  id="categoryImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <CButton type="submit" color="primary" disabled={loading}>
                {loading ? 'Adding...' : 'Submit'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddCategory
