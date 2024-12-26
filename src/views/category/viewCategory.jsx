import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import { db } from '../../firebaseConfig/firebase' // Make sure this is correctly imported
import { collection, getDocs } from 'firebase/firestore'

const ViewCategory = () => {
  const [categories, setCategories] = useState([]) // State to store fetched categories
  const [loading, setLoading] = useState(true) // To track loading state
  const [error, setError] = useState(null) // To track any errors

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const categorySnapshot = await getDocs(collection(db, 'categories'))
      const categoryList = categorySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setCategories(categoryList)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleEdit = (index) => {
    console.log('Edit category at index:', index)
  }

  const handleDelete = (index) => {
    console.log('Delete category at index:', index)
  }

  if (loading) {
    return <p>Loading categories...</p>
  }

  if (error) {
    return <p className="text-danger">{error}</p>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Category List</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Category Name</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Image</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {categories.map((category, index) => (
                  <CTableRow key={category.id}>
                    <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{category.categoryName}</CTableDataCell>
                    <CTableDataCell>{category.categoryDescription}</CTableDataCell>
                    <CTableDataCell>
                      {category.categoryImage ? (
                        <img
                          src={category.categoryImage}
                          alt="Category"
                          style={{ width: '50px' }}
                        />
                      ) : (
                        <p>No Image</p>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ViewCategory
