# Quote Request Process Documentation

## Overview

The Great Beans Coffee website provides a comprehensive Request for Quote (RFQ) system that enables B2B customers to request detailed pricing for coffee products. This documentation covers the complete quote request process, from initial submission to final order conversion.

---

## Table of Contents

1. [Quote Request Process Overview](#quote-request-process-overview)
2. [RFQ Form Structure](#rfq-form-structure)
3. [Quote Lifecycle Management](#quote-lifecycle-management)
4. [Dashboard Quote Management](#dashboard-quote-management)
5. [Quote Status Tracking](#quote-status-tracking)
6. [Communication & Collaboration](#communication--collaboration)
7. [Quote Comparison & Analysis](#quote-comparison--analysis)
8. [Mobile Experience](#mobile-experience)
9. [API Integration](#api-integration)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Quote Request Process Overview

### Process Flow

1. **Quote Initiation**
   - Access via homepage CTA buttons
   - Product detail page "Request Quote" button
   - Direct navigation to `/quote` page
   - Dashboard "New Quote" button

2. **Form Completion**
   - 5-step guided form process
   - Real-time validation and error handling
   - Auto-save functionality (draft state)
   - Progress tracking with visual indicators

3. **Submission & Confirmation**
   - Form validation and submission
   - Unique RFQ reference number generation
   - Email confirmation to customer
   - Internal notification to sales team

4. **Quote Processing**
   - Sales team review and assignment
   - Product availability verification
   - Pricing calculation and approval
   - Quote preparation and documentation

5. **Quote Response**
   - Detailed quote with pricing breakdown
   - Terms and conditions specification
   - Delivery timeline and logistics
   - Supporting documentation and attachments

6. **Decision & Conversion**
   - Quote review and comparison
   - Negotiation and revision cycles
   - Final acceptance or rejection
   - Order conversion and processing

---

## RFQ Form Structure

### Step 1: Product Requirements

**Coffee Specifications:**

- **Coffee Type**: Arabica, Robusta, Specialty blends
- **Grade**: Premium, Commercial, Specialty grades
- **Processing Method**: Washed, Natural, Honey, Pulped Natural
- **Screen Size**: 16+, 17+, 18+, custom specifications
- **Moisture Content**: Maximum percentage (typically 12.5%)
- **Defect Rate**: Maximum allowable defects per sample
- **Certifications**: Organic, Fair Trade, Rainforest Alliance, UTZ
- **Origin**: Country, region, specific farm/cooperative

**Quality Parameters:**

- Cup score requirements
- Flavor profile preferences
- Roast level specifications
- Bean appearance standards

### Step 2: Quantity & Delivery Requirements

**Quantity Specifications:**

- **Primary Quantity**: Amount in metric tons (MT) or kilograms
- **Unit Selection**: MT, KG, Bags (60kg), Containers
- **Tolerance**: Acceptable quantity variance (±5%, ±10%)
- **Recurring Orders**: Monthly, Quarterly, Semi-annual, Annual
- **Minimum Order**: Quantity thresholds

**Delivery Requirements:**

- **Incoterms**: EXW, FOB, CFR, CIF, DAP, DDP
- **Destination Port**: Specific port or city
- **Destination Country**: Final delivery location
- **Preferred Delivery Date**: Target timeline
- **Latest Delivery Date**: Maximum acceptable delay
- **Packaging**: Jute bags, GrainPro, bulk containers

### Step 3: Payment Terms

**Financial Specifications:**

- **Preferred Currency**: USD, EUR, local currency
- **Payment Method**: Bank transfer, Letter of Credit, Trade finance
- **Payment Terms**: Advance payment, Net 30/60/90, COD
- **Advance Percentage**: Upfront payment requirements
- **Credit Terms**: Extended payment options

### Step 4: Company Information

**Business Details:**

- **Company Name**: Legal business name
- **Contact Person**: Primary decision maker
- **Position/Title**: Role within organization
- **Email Address**: Primary communication channel
- **Phone Number**: Direct contact number
- **Website**: Company website URL

**Address Information:**

- **Street Address**: Physical location
- **City/State**: Geographic details
- **Postal Code**: Shipping reference
- **Country**: Legal jurisdiction
- **Business Type**: Importer, Roaster, Distributor, Retailer
- **Company Size**: Annual volume, employee count

### Step 5: Additional Details

**Special Requirements:**

- **Additional Specifications**: Custom requirements
- **Sample Requirements**: Physical sample needs
- **Sample Address**: Delivery location for samples
- **Urgency Level**: Low, Medium, High priority
- **Urgency Reason**: Justification for expedited processing
- **Internal Notes**: Additional context or instructions

---

## Quote Lifecycle Management

### Status Progression

1. **DRAFT**
   - Form in progress, not yet submitted
   - Auto-save functionality active
   - Can be resumed and completed later

2. **SUBMITTED**
   - Form completed and submitted
   - RFQ number assigned
   - Confirmation email sent
   - Internal notification triggered

3. **UNDER_REVIEW**
   - Sales team reviewing requirements
   - Product availability being verified
   - Initial feasibility assessment
   - Assignment to account manager

4. **QUOTED**
   - Formal quote prepared and sent
   - Pricing and terms finalized
   - Quote validity period active
   - Customer notification sent

5. **NEGOTIATING**
   - Back-and-forth communication active
   - Terms being discussed and refined
   - Potential revisions and counter-offers
   - Multiple quote versions possible

6. **ACCEPTED**
   - Customer accepted quote terms
   - Ready for order conversion
   - Contract preparation initiated
   - Logistics planning begins

7. **REJECTED**
   - Customer declined quote
   - Reason for rejection documented
   - Feedback collected for improvement
   - Relationship maintenance continues

8. **EXPIRED**
   - Quote validity period ended
   - No customer response received
   - Follow-up communication triggered
   - Potential for quote renewal

9. **CANCELLED**
   - Customer cancelled request
   - Internal cancellation by sales team
   - Requirements no longer valid
   - Process terminated

### Timeline Management

**Response Times:**

- **Initial Acknowledgment**: Within 2 hours
- **Preliminary Review**: Within 24 hours
- **Detailed Quote**: Within 48-72 hours
- **Complex Requirements**: Up to 5 business days

**Quote Validity:**

- **Standard Quotes**: 30 days
- **Volatile Markets**: 7-14 days
- **Long-term Contracts**: 60-90 days
- **Custom Extensions**: Case-by-case basis

---

## Dashboard Quote Management

### Quote Overview Dashboard

**Summary Metrics:**

- Total RFQs submitted
- Active quotes pending response
- Quotes under review
- Total estimated value
- Average response time
- Conversion rate statistics

**Quick Actions:**

- Create new RFQ
- View all quotes
- Filter by status
- Export quote data
- Download reports

### Individual Quote Management

**Quote Details View:**

- Complete RFQ information
- Status history and timeline
- Communication log
- Document attachments
- Quote versions and revisions

**Available Actions:**

- Update quote status
- Add internal notes
- Upload documents
- Send messages
- Schedule follow-ups
- Generate reports

### Bulk Operations

**Multi-Quote Management:**

- Bulk status updates
- Mass communication
- Batch reporting
- Group assignments
- Priority adjustments

---

## Quote Status Tracking

### Real-time Updates

**Status Notifications:**

- Email alerts for status changes
- Dashboard notifications
- Mobile push notifications (if applicable)
- SMS updates for urgent items

**Progress Indicators:**

- Visual status timeline
- Percentage completion
- Estimated time remaining
- Next action required

### Communication History

**Activity Log:**

- All status changes
- User interactions
- System updates
- External communications
- Document uploads

**Audit Trail:**

- Complete change history
- User attribution
- Timestamp tracking
- Reason codes
- Approval workflows

---

## Communication & Collaboration

### Internal Communication

**Team Collaboration:**

- Internal notes and comments
- Task assignments
- Approval workflows
- Escalation procedures
- Knowledge sharing

**Customer Communication:**

- Automated status updates
- Personalized messages
- Document sharing
- Video call scheduling
- Meeting coordination

### Document Management

**Supported File Types:**

- PDF documents
- Excel spreadsheets
- Word documents
- Image files (JPG, PNG)
- CAD drawings (if applicable)

**Document Categories:**

- RFQ specifications
- Quote responses
- Contracts and agreements
- Quality certificates
- Shipping documents
- Payment confirmations

---

## Quote Comparison & Analysis

### Multi-Quote Analysis

**Comparison Features:**

- Side-by-side quote comparison
- Price breakdown analysis
- Terms and conditions review
- Delivery timeline comparison
- Quality specification matching

**Decision Support:**

- Total cost of ownership
- Risk assessment
- Supplier evaluation
- Quality scoring
- Delivery reliability

### Reporting & Analytics

**Quote Performance:**

- Response time analytics
- Conversion rate tracking
- Win/loss analysis
- Customer satisfaction metrics
- Revenue pipeline reporting

**Business Intelligence:**

- Market trend analysis
- Pricing optimization
- Customer behavior insights
- Seasonal demand patterns
- Competitive positioning

---

## Mobile Experience

### Mobile-Optimized Features

**Responsive Design:**

- Touch-friendly interface
- Optimized form layouts
- Swipe navigation
- Mobile-specific interactions
- Offline capability (limited)

**Mobile-Specific Functions:**

- Photo upload for specifications
- GPS location for delivery
- Push notifications
- Quick actions
- Voice input (where supported)

---

## API Integration

### RFQ Submission API

**Endpoint:** `POST /api/rfq`

**Request Format:**

```json
{
  "productType": ["ARABICA"],
  "grade": ["PREMIUM"],
  "origin": ["VIETNAM"],
  "quantity": 1000,
  "quantityUnit": "MT",
  "deliveryTerms": "FOB",
  "companyName": "Example Coffee Co.",
  "contactPerson": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "country": "United States"
}
```

**Response Format:**

```json
{
  "success": true,
  "rfqNumber": "RFQ-2024-001",
  "message": "RFQ submitted successfully",
  "estimatedResponse": "2024-01-17T10:00:00Z"
}
```

### Quote Management API

**Status Update:** `PATCH /api/rfq/{id}/status`
**Add Quote:** `POST /api/rfq/{id}/quotes`
**Get Quotes:** `GET /api/rfq/{id}/quotes`
**Update Quote:** `PATCH /api/rfq/{id}/quotes/{quoteId}`

---

## Best Practices

### For Customers

**RFQ Preparation:**

- Provide detailed specifications
- Include realistic timelines
- Specify quality requirements clearly
- Attach relevant documentation
- Indicate budget ranges when possible

**Communication:**

- Respond promptly to clarification requests
- Provide feedback on quotes received
- Maintain open dialogue throughout process
- Share market insights and requirements

### For Sales Teams

**Response Management:**

- Acknowledge RFQs within 2 hours
- Provide realistic timelines
- Ask clarifying questions early
- Document all communications
- Follow up consistently

**Quote Preparation:**

- Include detailed breakdowns
- Specify all terms clearly
- Provide alternative options
- Include supporting documentation
- Set appropriate validity periods

---

## Troubleshooting

### Common Issues

**Form Submission Problems:**

- **Issue**: Form validation errors
- **Solution**: Check required fields, verify email format, ensure quantity is positive
- **Prevention**: Use real-time validation, provide clear error messages

**Quote Status Confusion:**

- **Issue**: Unclear status meanings
- **Solution**: Refer to status definitions, check communication history
- **Prevention**: Provide status explanations, send clear notifications

**Communication Delays:**

- **Issue**: Slow response times
- **Solution**: Check spam folders, verify contact information, use alternative channels
- **Prevention**: Set clear expectations, provide multiple contact methods

### Technical Support

**Contact Information:**

- **Email**: support@greatbeans.com
- **Phone**: +84-xxx-xxx-xxxx
- **Live Chat**: Available during business hours
- **Help Center**: Comprehensive FAQ and guides

**Escalation Process:**

1. First-level support (technical issues)
2. Account manager (business issues)
3. Sales director (complex negotiations)
4. Management team (strategic decisions)

---

## Conclusion

The Great Beans Coffee quote request process is designed to provide a seamless, efficient, and transparent experience for B2B customers. By following this documentation, users can effectively navigate the system, submit comprehensive RFQs, and manage the entire quote lifecycle from initial request to final order conversion.

For additional support or specific questions not covered in this documentation, please contact our customer support team or your dedicated account manager.
