const renderPropertyInputs = (properties, propertyType, person) => {
        return properties.map((property, index) => (
            <div key={`${propertyType}-${person}-${index}`} className={`property-group  ${index > 0 ? 'position-relative mb-3 p-3 border rounded' : ''}`}>
                {index > 0 && (
                    <button
                        type="button"
                        onClick={() => removeProperty(propertyType, person, index)}
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        style={{ width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
                        aria-label="Remove property"
                    >
                        ×
                    </button>
                )}
                <label className="form-label responsive-label">
                    Property Address
                </label>
                <input
                    id={`${propertyType}-${person}-address-${index}`}
                    type="text"
                    className="form-control"
                    value={property.address}
                    onChange={(e) => handlePropertyChange(propertyType, person, index, 'address', e.target.value)}
                    placeholder={`Enter Address ${index + 1}`}
                />
                <label className="form-label responsive-label">
                    Estimated Value
                </label>
                <input
                    id={`${propertyType}-${person}-value-${index}`}
                    type="text"
                    className="form-control"
                    value={property.value}
                    onChange={(e) => handlePropertyChange(propertyType, person, index, 'value', e.target.value)}
                    placeholder="Enter Value"
                />
            </div>
        ));
    };


    export default renderPropertyInputs;  