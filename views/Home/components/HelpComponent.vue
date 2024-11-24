<template>
    <div class="help--desk__content">
        <h3 class="help--desk__content--title ma-0 pa-1">
            <i class="fa fa-question-circle"></i>
            {{currentPage}} Page Help
        </h3>

        <div class="help--desk__content--info" v-if="currentPage == 'Dashboard'">
            <p class="ma-1">Here on your <span class="color--tertiary-blue text--weight-bold">Home Page</span>, all your account statistics are available for a quick overview.  To learn more or take action, please visit the specific page.</p>
            <p class="ma-1">The <span class="color--primary text--weight-bold">Left Side Bar</span> is your navigation tool to move between pages.</p>
            <p class="ma-1">The top <span class="color--primary text--weight-bold">Dropdown Menu</span> is the list of sites you have access to.  If you are assigned to more than one page, you will be able to use this dropdown to switch the current screen to view each sites information.</p>
            <p class="ma-1"><span class="color--tertiary-blue text--weight-bold">Available Credits</span> – This is the current number of credits in your account.  This number will change as you add or spend credits.</p>
            <p class="ma-1"><span class="color--secondary-blue text--weight-bold">{{ leadName }} Available</span> – This is the number of new {{ leadName.toLowerCase() }} collected by the Pixel that haven’t been purchased yet.  Return visitors are not counted here.  Clicking on the icon will take you directly to the {{ leadName }} Available page.</p>
            <p class="ma-1"><span class="color--primary-teal text--weight-bold">{{ leadName }} Purchased</span> –  This is the aggregate number of {{ leadName.toLowerCase() }} purchased to date.  You can re-purchase additional data points for these lists, but you won’t need to re-purchase the original info again. Clicking on the icon will take you directly to the {{ leadName }} Purchased page.</p>
            <p class="ma-1"><span class="color--tertiary-blue text--weight-bold">Total Spent</span> – This is the total amount you have spent to date.  Visit the Billing page to see the per-purchase spend.  Clicking on the icon will take you directly to the Billing page where your invoices are listed.</p>
            <p class="ma-1"><span class="color--primary-purple text--weight-bold">Total Sites</span> – This is the number of sites you have access to.  It includes all URLs where you can create and place a pixel.  If you are an Admin, you can create and add new sites.  If you are a Client, you will need to contact your Admin for access to other sites.  Visit the Sites page for more information.  Clicking on the icon will take you directly to the Sites page.</p>
            <p class="ma-1"><span class="color--tertiary-blue text--weight-bold">{{ leadName }} by Date, Top Locations, Recent Purchases and Recent {{ leadName }}</span> – This is an overview only of your account statistics.  To learn more, please visit the specific page.</p>
        </div>  

        <div class="help--desk__content--info" v-if="currentPage == 'Leads'">
            <p class="ma-1">
                Here you’ll find two kinds of {{ leadName.toLowerCase() }} – those available to be purchased, and those already purchased.
            </p>
            <p class="ma-1">
                You are not charged for collected {{ leadName.toLowerCase() }}.  You do not pay until you purchase the data attached to the lead.  You do not have to purchase all {{ leadName.toLowerCase() }} or all data fields at the same time. 
            </p>
            <p class="ma-1">
                The <span class="color--primary text--weight-bold">Available</span> tab shows you the total number of new {{ leadName.toLowerCase() }} that have been collected by the pixel.  It includes all new {{ leadName.toLowerCase() }} since your last purchase and download, and any {{ leadName.toLowerCase() }} that might have been available but not yet purchased previously.  
            </p>
            <p class="ma-1">
                <span class="text--style-italic">Example:</span>  If there were 100 {{ leadName.toLowerCase() }} collected to date, and you purchased 75, that would leave 25 {{ leadName.toLowerCase() }}.  If 10 more {{ leadName.toLowerCase() }} came in since then, you would have a total of 35 {{ leadName.toLowerCase() }} available to purchase.
            </p>
            <p class="ma-1">
                <span class="color--primary text--weight-bold">Available</span> {{ leadName.toLowerCase() }} are purchased in a batch.  You can buy all <span class="color--primary text--weight-bold">Available</span> {{ leadName.toLowerCase() }} by State, Zip code and timeframe.  For example: You may want all the {{ leadName.toLowerCase() }} from one state that have come in during the last 24 hours only. 
            </p>
             <p class="ma-1">
                 Click the <span class="color--primary-teal text--weight-bold">FILTER</span> button to see a list of {{ leadName.toLowerCase() }} available by State, Zip Code and timeframe.  First select the State(s) in order see the Zip Codes.  The FILTER button allows you to view subsets of {{ leadName.toLowerCase() }}.  To purchase the {{ leadName.toLowerCase() }} in the subset, click the Select All box.  Once selected, a <span class="color--primary-green text--weight-bold">Purchase</span> button will appear, along with a <span class="text--weight-bold">Selected {{ leadName }}</span> count.
            </p>
             <p class="ma-1">
                 <span class="text--weight-bold">Total {{ leadName }}</span> is the number of currently available {{ leadName.toLowerCase() }} to purchase, not the cumulative count of {{ leadName.toLowerCase() }} that have been available, or the {{ leadName.toLowerCase() }} you have selected to purchase.  This number is dynamic, adding new {{ leadName.toLowerCase() }} that have been collected and subtracting {{ leadName.toLowerCase() }} that have been purchased. 
            </p>
            <p class="ma-1">
                When you select {{ leadName.toLowerCase() }} to purchase, you will be able to choose from a menu of information parameters such as first and last name, email, Facebook ID, etc.  You do not have to purchase every parameter the first time. You can update the parameters by <span class="color--primary-green text--weight-bold">Repurchasing</span> them at a later time.  See below for more details.
            </p>
            <p class="ma-1">
                <span class="text--weight-bold">IMPORTANT NOTE:</span> In general, you will be able to purchase approximately 50% of {{ leadName.toLowerCase() }} due to the hygiene process.  When you purchase {{ leadName.toLowerCase() }}, they are first run through the Federal hygiene process and all {{ leadName.toLowerCase() }} on a “Do Not Contact” registry are removed.  You will not know the final count until after this process.  <span class="text--style-italic">Example:</span>  If you have 100 Available {{ leadName.toLowerCase() }}, you may only receive 50 of them.  You will only be charged credits for {{ leadName.toLowerCase() }} actually delivered. 
            </p>
            <p class="ma-1">
                <span class="text--style-italic">Example:</span> 100 {{ leadName.toLowerCase() }} purchased x 3 parameters = 300 credits allocated.<br />50 {{ leadName.toLowerCase() }} delivered x 3 parameters = 150 actual credits charged.
            </p>
            <p class="ma-1">
                You will need to have the maximum number of necessary credits to make the initial purchase, even though you may be refunded credits upon delivery.
            </p>
            <p class="ma-1">
                The <span class="color--primary-teal text--weight-bold">Purchased</span> tab shows all the {{ leadName.toLowerCase() }} you’ve purchased to date by batch. 
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Purchase Date</span> is the date you ordered the {{ leadName.toLowerCase() }}, not the date they were downloaded.
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Number of {{ leadName }}</span> is the number you ordered, not the final number delivered.
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Purchased Fields</span> is the list of fields you selected and purchased.
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Status </span> is either Processing for {{ leadName.toLowerCase() }} just ordered, or Ready to download.
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Credits Used</span> reflects the number of purchased fields x the number of {{ leadName.toLowerCase() }} delivered.  See the example above. 
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Actions </span> allows you to <span class="color--primary">Download</span> the {{ leadName.toLowerCase() }} or <span class="color--primary-green">Repurchase</span> new fields.   These links appear only once the Status is Ready.
            </p>
            <p class="ma-1">
                {{ leadName }} can be downloaded by selecting all the {{ leadName.toLowerCase() }} you’ve purchased and clicking on the Download button.   This will export the {{ leadName.toLowerCase() }} into a CSV, PDF or XLSX (Excel) file.  You will be asked which file type you want in a pop-up screen. 
            </p>
            <p class="ma-1">
                Returning visitors to your website are not re-counted in the <span class="color--primary text--weight-bold">Available</span> tab.
            </p>
            <p class="ma-1">
                If you want to add fields to your {{ leadName.toLowerCase() }}, you can purchase a new data field to append to the file by using the <span class="color--primary-green">Repurchase</span> link.  You can <span class="color--primary-green">Repurchase</span> (append) data only in the original batches at this time.
            </p>
            <p class="ma-1">
                You can also <span class="color--primary-green text--weight-bold">Repurchase</span> a parameter in order to refresh the database.  <span class="text--style-italic">Example: You know 30% of your customer base moves each year, so you repurchase addresses to ensure the most recent address is in your database.</span>
            </p>
            <p class="ma-1">
                To <span class="color--primary-green text--weight-bold">Repurchase</span> filers:
            </p>
            <ul class="pa--left-3">
                <li>Select the batch you want to append, then click the <span class="color--primary-green text--weight-bold">Repurchase</span> tab.</li>
                <li>•	Fields previously purchased for the batch will be unavailable for repurchase. </li>
                <li>In the pop-up, select the data parameter you want to ad (i.e. <span class="text--style-italic">Twitter ID</span>).</li>
                <li>Click <span class="color--secondary-blue text--weight-bold">Proceed</span>.</li>
                <li>Confirm you are purchasing the fields you want. Either go <span class="color--primary-black">Back</span> to adjust or <span class="color--secondary-blue text--weight-bold">Purchase</span> to continue.</li>
                <li>If you want to cancel, click <span class="color--primary-black">Back</span> and then click <span class="color--primary-black">Cancel </span> on the first pop up window.</li>
                <li>Once you have purchased your selected parameters, click the {{ leadName.toLowerCase() }} you want to download and then click the <span class="color--secondary-blue text--weight-bold">Download</span> button to export.</li>
            </ul>
            <p class="ma-1">
               If you do not have enough credits to purchase selected data, you will need to purchase more credits or select less data and/or parameters.
            </p>
        </div>

        <div class="help--desk__content--info" v-if="currentPage == 'Sites'">
            <p class="ma-1">
                If your business has multiple locations or multiple URLs for product segments, you can add multiple sites to help track different audiences.  Each separate URL requires a separate pixel.  
            </p>
            <p class="ma-1">
                First, add a site by clicking the <span class="color--secondary-blue text--weight-bold">Add Site</span> button on the top left.  This creates a new Site on your list. Once the new Site is added to the list, click on the <span class="color--secondary-blue text--weight-bold">&lt;/&gt;</span> <span class="color--tertiary-blue text--weight-bold">Action</span> button to create a new pixel. When you hover over the <span class="color--secondary-blue text--weight-bold">&lt;/&gt;</span> button, you’ll see a <span class="text--weight-bold">Generate Pixel Tracking</span> flag. Click the button to access the pop-up window. 
            </p>
            <p class="ma-1">
                The pixel code is automatically generated.  You can copy it and install it yourself, or input the email address of your developer to send the code to the person who will place the code on your website.  
            </p>
            <p class="ma-1">
                Install the code before the end of the body tag.  Once the pixel is properly placed, it will send a confirmation email that it is active.  This happens automatically and confirms the pixel has been deployed properly.  
            </p>
            <p class="ma-1">
                If for some reason you need to re-install the pixel code on a current site, clicking the <span class="color--secondary-blue text--weight-bold">&lt;/&gt;</span> <span class="color--tertiary-blue text--weight-bold">Action</span> button will provide you with the same code again.
            </p>
            <p class="ma-1">
                The <span class="text--weight-bold">Status</span> of a site is Processing, Approved or Paused.  Processing means the pixel code has been generated, but the pixel has not confirmed its deployment.  Paused is when you pause data collection.  Approved is when the pixel is properly deployed and actively collecting data. 
            </p>
            <p class="ma-1">
                For a variety of reasons, you may wish to <span class="text--weight-bold">Pause</span> or <span class="text--weight-bold">Unpause</span> the pixel on a site.  Click the <span class="fa fa-play"></span> Action icon.  If <span class="text--weight-bold">Paused</span>, data collection from the pixel on the associated site stops until <span class="text--weight-bold">Unpaused</span>. Be sure you want to <span class="text--weight-bold">Pause</span> or <span class="text--weight-bold">Unpaused</span> the pixel! An email is sent to the admin and the user that the data collection status has changed.
            </p>
            <p class="ma-1">
                To delete a site, click the <span class="color--primary-red text--weight-bold">Trash Can</span> button under <span class="color--primary-black text--weight-bold">Actions</span>. Deleting the site from the list breaks the link to this dashboard and will make it impossible to collect new information collected from the pixel. It will freeze data collected but not yet purchased.  You will be able to purchase the collected data, but the list will no longer grow. 
            </p>
            <p class="ma-1">
                If you delete a site you can re-add it, but it will be like starting over. You will need to generate a new pixel code to install on the site.   
            </p>
            <p class="ma-1">
                To delete a pixel from a website, you will need to remove the code from the website manually.  
            </p>
            <p class="ma-1">
                If you delete the actual website, you will delete the pixel. If you delete your website it will break the link to this dashboard.  You will need to also delete the site from the dashboard to remove it from the list.
            </p>
        </div>

        <div class="help--desk__content--info" v-if="currentPage == 'Billing'">
            <p class="ma-1">
                Data is purchased through credits.  This allows us to offset price fluctuations in the daily market and protect your ability to budget for data purchases.  At the top right of each page are the <span class="color--tertiary-blue text--weight-bold">Available Credits</span> you currently have.   Credits cost $1 each.
            </p>
            <p class="ma-1">
                To purchase credits, click the <span class="color--secondary-blue text--weight-bold">Buy Credit</span> button at the top left corner.  Manually enter the number of credits you wish to buy.  Your account may have a monthly minimum, so plan to purchase enough credits for the month.  
            </p>
            <p class="ma-1">
                The pop-up will show the number of credits you are buying and their cost in U.S. dollars.  Click <span class="color--primary text--weight-bold">Confirm</span> to progress to the payment page.
            </p>
            <p class="ma-1">
                You will be directed to pay through a Stripe payment page.  You will be prompted to pay with a credit card. Once the card has been entered, Stripe will remember it for the next time. We do not accept payments through other methods at this time.  
            </p>
            <p class="ma-1">
                The log on this page shows the dates and amounts of previous purchases with a link to the <span class="color--primary text--weight-bold">Invoice</span>.  We do not store Invoices on our servers currently, so you will need to click the Invoice link to view the Invoice and <span class="text--weight-bold">Print</span> or <span class="text--weight-bold">Print to PDF.</span> 
            </p>
            <p class="ma-1">
                Invoices are numbered in the order they are generated for all users assigned to a site.  If other users on your site(s) are authorized to purchase credits, the invoices they purchased are under their accounts. 
            </p>
        </div>

        <div class="help--desk__content--info" v-if="currentPage == 'Users'">
            <p class="ma-1">Users can be Admins or Clients.  Admins have administrative access to the site and can <span class="color--primary text--weight-bold">Add</span>, <span class="color--primary-purple text--weight-bold">Assign</span> and <span class="color--primary-green text--weight-bold">Invite</span> new users.   Admins can <span class="color--primary text--weight-bold">Edit</span>, <span class="color--primary-green text--weight-bold">Assign Credits</span>, <span class="color--primary-purple text--weight-bold">Lock, Unlock</span> or <span class="color--primary-red text--weight-bold">Delete</span> Admins and Clients under their account.  The Admin creating or inviting the new user determines their role.</p>
            <p class="ma-1">Before Adding, Assigning or Inviting a new user, be sure you are in the proper site screen – indicated by the <span class="color--primary text--weight-bold">Dropdown</span> menu on the top bar. </p>
            <p class="ma-1">Click the <span class="color--primary text--weight-bold">Add User</span> button at the top left to enter the profile and contact info for a new user.  An email will be sent to the admin and the new user.  When the new user clicks the confirmation button in the email they receive, they will be added to the User list. </p>
            <p class="ma-1">Once added to the User list, the Admin can assign a user to site with the <span class="color--primary-purple text--weight-bold">Assign User</span> button.  </p>
            <p class="ma-1"><span class="color--primary-green text--weight-bold">Invite User</span> allows an Admin to send an email to a new user so they can set up their account.  Once the new user clicks the <span class="color--primary text--weight-bold">Create Account</span> button in the email panel, they are redirected to a screen where they enter their information and password.  Once the account is initialized, their <span class="color--tertiary-blue text--weight-bold">Status</span> will change from <span class="color--primary-red text--weight-bold">Pending</span> to <span class="color--primary text--weight-bold">Active</span>.</p>
            <p class="ma-1">An Admin can <span class="color--primary text--weight-bold">Edit Profile</span>.  This allows them to change the name, email, phone number or role of the User between Admin and Client.   </p>
            <p class="ma-1">An Admin can <span class="color--primary-green text--weight-bold">Assign Credits</span> to a User.  Clicking the <span class="color--primary-green text--weight-bold">$</span> <span class="color--tertiary-blue text--weight-bold">Action</span> button allows them to see how many credits the User currently has assigned and then manually add additional credits.  </p>
            <p class="ma-1">An Admin can <span class="color--primary-purple text--weight-bold">Lock</span> or <span class="color--primary-purple text--weight-bold">Unlock</span> a user for testing and security purposes.  Clicking the Lock Action button changes the status to Lock or Unlock.  An email is sent to the admin that the status has changed.  The User is not notified. </p>
            <p class="ma-1">An Admin can delete a user with the <span class="color--primary-red text--weight-bold">Trash</span> Action button.  Once the User is deleted, they will need to be re-added and reassigned to reconnect them.</p>
        </div>

        <div class="help--desk__content--info" v-if="currentPage == 'Support'">
            <p class="ma-1">This page is used for communicating with the Customer Management Team behind the dashboard.  Currently we support email communication only.</p>
            <p class="ma-1">Please read the <span class="color--secondary-blue text--weight-bold">HELP</span> comments on the <span class="color--secondary-blue text--weight-bold">Right Sidebar</span> of each page first to see if your questions can be answered at the source.</p>
            <p class="ma-1">Once your question is submitted, we will get back to you within 48-72 hours.</p>
            <p class="ma-1">Below is a list of all the <span class="color--secondary-blue text--weight-bold">HELP</span> comments available. </p>
            <h3 class="ma-1">HOME PAGE</h3>
            <p class="ma-1">Here on your <span class="color--tertiary-blue text--weight-bold">Home Page</span>, all your account statistics are available for a quick overview.  To learn more or take action, please visit the specific page.</p>
            <p class="ma-1">The <span class="color--primary text--weight-bold">Left Side Bar</span> is your navigation tool to move between pages.</p>
            <p class="ma-1">The top <span class="color--primary text--weight-bold">Dropdown Menu</span> is the list of sites you have access to.  If you are assigned to more than one page, you will be able to use this dropdown to switch the current screen to view each sites information.</p>
            <p class="ma-1"><span class="color--tertiary-blue text--weight-bold">Available Credits</span> – This is the current number of credits in your account.  This number will change as you add or spend credits.</p>
            <p class="ma-1"><span class="color--secondary-blue text--weight-bold">{{ leadName }} Available</span> – This is the number of new {{ leadName.toLowerCase() }} collected by the Pixel that haven’t been purchased yet.  Return visitors are not counted here.  Clicking on the icon will take you directly to the {{ leadName }} Available page.</p>
            <p class="ma-1"><span class="color--primary-teal text--weight-bold">{{ leadName }} Purchased</span> –  This is the aggregate number of {{ leadName.toLowerCase() }} purchased to date.  You can re-purchase additional data points for these lists, but you won’t need to re-purchase the original info again. Clicking on the icon will take you directly to the {{ leadName }} Purchased page.</p>
            <p class="ma-1"><span class="color--tertiary-blue text--weight-bold">Total Spent</span> – This is the total amount you have spent to date.  Visit the Billing page to see the per-purchase spend.  Clicking on the icon will take you directly to the Billing page where your invoices are listed.</p>
            <p class="ma-1"><span class="color--primary-purple text--weight-bold">Total Sites</span> – This is the number of sites you have access to.  It includes all URLs where you can create and place a pixel.  If you are an Admin, you can create and add new sites.  If you are a Client, you will need to contact your Admin for access to other sites.  Visit the Sites page for more information.  Clicking on the icon will take you directly to the Sites page.</p>
            <p class="ma-1"><span class="color--tertiary-blue text--weight-bold">{{ leadName }} by Date, Top Locations, Recent Purchases and Recent {{ leadName }}</span> – This is an overview only of your account statistics.  To learn more, please visit the specific page.</p>
            <h3 class="ma-1">LEADS PAGE</h3>
            <p class="ma-1">
                Here you’ll find two kinds of {{ leadName.toLowerCase() }} – those available to be purchased, and those already purchased.
            </p>
            <p class="ma-1">
                You are not charged for collected {{ leadName.toLowerCase() }}.  You do not pay until you purchase the data attached to the lead.  You do not have to purchase all {{ leadName.toLowerCase() }} or all data fields at the same time. 
            </p>
            <p class="ma-1">
                The <span class="color--primary text--weight-bold">Available</span> tab shows you the total number of new {{ leadName.toLowerCase() }} that have been collected by the pixel.  It includes all new {{ leadName.toLowerCase() }} since your last purchase and download, and any {{ leadName.toLowerCase() }} that might have been available but not yet purchased previously.  
            </p>
            <p class="ma-1">
                <span class="text--style-italic">Example:</span>  If there were 100 {{ leadName.toLowerCase() }} collected to date, and you purchased 75, that would leave 25 {{ leadName.toLowerCase() }}.  If 10 more {{ leadName.toLowerCase() }} came in since then, you would have a total of 35 {{ leadName.toLowerCase() }} available to purchase.
            </p>
            <p class="ma-1">
                <span class="color--primary text--weight-bold">Available</span> {{ leadName.toLowerCase() }} are purchased in a batch.  You can buy all <span class="color--primary text--weight-bold">Available</span> {{ leadName.toLowerCase() }} by State, Zip code and timeframe.  For example: You may want all the {{ leadName.toLowerCase() }} from one state that have come in during the last 24 hours only. 
            </p>
             <p class="ma-1">
                 Click the <span class="color--primary-teal text--weight-bold">FILTER</span> button to see a list of {{ leadName.toLowerCase() }} available by State, Zip Code and timeframe.  First select the State(s) in order see the Zip Codes.  The FILTER button allows you to view subsets of {{ leadName.toLowerCase() }}.  To purchase the {{ leadName.toLowerCase() }} in the subset, click the Select All box.  Once selected, a <span class="color--primary-green text--weight-bold">Purchase</span> button will appear, along with a <span class="text--weight-bold">Selected {{ leadName }}</span> count.
            </p>
             <p class="ma-1">
                 <span class="text--weight-bold">Total {{ leadName }}</span> is the number of currently available {{ leadName.toLowerCase() }} to purchase, not the cumulative count of {{ leadName.toLowerCase() }} that have been available, or the {{ leadName.toLowerCase() }} you have selected to purchase.  This number is dynamic, adding new {{ leadName.toLowerCase() }} that have been collected and subtracting {{ leadName.toLowerCase() }} that have been purchased. 
            </p>
            <p class="ma-1">
                When you select {{ leadName.toLowerCase() }} to purchase, you will be able to choose from a menu of information parameters such as first & last name, email, Facebook ID, etc.  You do not have to purchase every parameter the first time. You can update the parameters by <span class="color--primary-green text--weight-bold">Repurchasing</span> them at a later time.  See below for more details.
            </p>
            <p class="ma-1">
                <span class="text--weight-bold">IMPORTANT NOTE:</span> In general, you will be able to purchase approximately 50% of {{ leadName.toLowerCase() }} due to the hygiene process.  When you purchase {{ leadName.toLowerCase() }}, they are first run through the Federal hygiene process and all {{ leadName.toLowerCase() }} on a “Do Not Contact” registry are removed.  You will not know the final count until after this process.  <span class="text--style-italic">Example:</span>  If you have 100 Available {{ leadName.toLowerCase() }}, you may only receive 50 of them.  You will only be charged credits for {{ leadName.toLowerCase() }} actually delivered. 
            </p>
            <p class="ma-1">
                <span class="text--style-italic">Example:</span> 100 {{ leadName.toLowerCase() }} purchased x 3 parameters = 300 credits allocated.<br />50 {{ leadName.toLowerCase() }} delivered x 3 parameters = 150 actual credits charged.
            </p>
            <p class="ma-1">
                You will need to have the maximum number of necessary credits to make the initial purchase, even though you may be refunded credits upon delivery.
            </p>
            <p class="ma-1">
                The <span class="color--primary-teal text--weight-bold">Purchased</span> tab shows all the {{ leadName.toLowerCase() }} you’ve purchased to date by batch. 
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Purchase Date</span> is the date you ordered the {{ leadName.toLowerCase() }}, not the date they were downloaded.
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Number of {{ leadName }}</span> is the number you ordered, not the final number delivered.
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Purchased Fields</span> is the list of fields you selected and purchased.
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Status </span> is either Processing for {{ leadName.toLowerCase() }} just ordered, or Ready to download.
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Credits Used</span> reflects the number of purchased fields x the number of {{ leadName.toLowerCase() }} delivered.  See the example above. 
            </p>
            <p class="ma-1">
                The <span class="color--tertiary-blue text--weight-bold">Actions </span> allows you to <span class="color--primary">Download</span> the {{ leadName.toLowerCase() }} or <span class="color--primary-green">Repurchase</span> new fields.   These links appear only once the Status is Ready.
            </p>
            <p class="ma-1">
                {{ leadName }} can be downloaded by selecting all the {{ leadName.toLowerCase() }} you’ve purchased and clicking on the Download button.   This will export the {{ leadName.toLowerCase() }} into a CSV, PDF or XLSX (Excel) file.  You will be asked which file type you want in a pop-up screen. 
            </p>
            <p class="ma-1">
                Returning visitors to your website are not re-counted in the <span class="color--primary text--weight-bold">Available</span> tab.
            </p>
            <p class="ma-1">
                If you want to add fields to your {{ leadName.toLowerCase() }}, you can purchase a new data field to append to the file by using the <span class="color--primary-green">Repurchase</span> link.  You can <span class="color--primary-green">Repurchase</span> (append) data only in the original batches at this time.
            </p>
            <p class="ma-1">
                You can also <span class="color--primary-green text--weight-bold">Repurchase</span> a parameter in order to refresh the database.  <span class="text--style-italic">Example: You know 30% of your customer base moves each year, so you repurchase addresses to ensure the most recent address is in your database.</span>
            </p>
            <p class="ma-1">
                To <span class="color--primary-green text--weight-bold">Repurchase</span> filers:
            </p>
            <ul class="pa--left-3">
                <li>Select the batch you want to append, then click the <span class="color--primary-green text--weight-bold">Repurchase</span> tab.</li>
                <li>•	Fields previously purchased for the batch will be unavailable for repurchase. </li>
                <li>In the pop-up, select the data parameter you want to ad (i.e. <span class="text--style-italic">Twitter ID</span>).</li>
                <li>Click <span class="color--secondary-blue text--weight-bold">Proceed</span>.</li>
                <li>Confirm you are purchasing the fields you want. Either go <span class="color--primary-black">Back</span> to adjust or <span class="color--secondary-blue text--weight-bold">Purchase</span> to continue.</li>
                <li>If you want to cancel, click <span class="color--primary-black">Back</span> and then click <span class="color--primary-black">Cancel </span> on the first pop up window.</li>
                <li>Once you have purchased your selected parameters, click the {{ leadName.toLowerCase() }} you want to download and then click the <span class="color--secondary-blue text--weight-bold">Download</span> button to export.</li>
            </ul>
            <p class="ma-1">
               If you do not have enough credits to purchase selected data, you will need to purchase more credits or select less data and/or parameters.
            </p>
            <h3 class="ma-1">SITES PAGE</h3>
            <p class="ma-1">
                If your business has multiple locations or multiple URLs for product segments, you can add multiple sites to help track different audiences.  Each separate URL requires a separate pixel.  
            </p>
            <p class="ma-1">
                First, add a site by clicking the <span class="color--secondary-blue text--weight-bold">Add Site</span> button on the top left.  This creates a new Site on your list. Once the new Site is added to the list, click on the <span class="color--secondary-blue text--weight-bold">&lt;/&gt;</span> <span class="color--tertiary-blue text--weight-bold">Action</span> button to create a new pixel. When you hover over the <span class="color--secondary-blue text--weight-bold">&lt;/&gt;</span> button, you’ll see a <span class="text--weight-bold">Generate Pixel Tracking</span> flag. Click the button to access the pop-up window. 
            </p>
            <p class="ma-1">
                The pixel code is automatically generated.  You can copy it and install it yourself, or input the email address of your developer to send the code to the person who will place the code on your website.  
            </p>
            <p class="ma-1">
                Install the code before the end of the body tag.  Once the pixel is properly placed, it will send a confirmation email that it is active.  This happens automatically and confirms the pixel has been deployed properly.  
            </p>
            <p class="ma-1">
                If for some reason you need to re-install the pixel code on a current site, clicking the <span class="color--secondary-blue text--weight-bold">&lt;/&gt;</span> <span class="color--tertiary-blue text--weight-bold">Action</span> button will provide you with the same code again.
            </p>
            <p class="ma-1">
                The <span class="text--weight-bold">Status</span> of a site is Processing, Approved or Paused.  Processing means the pixel code has been generated, but the pixel has not confirmed its deployment.  Paused is when you pause data collection.  Approved is when the pixel is properly deployed and actively collecting data. 
            </p>
            <p class="ma-1">
                For a variety of reasons, you may wish to <span class="text--weight-bold">Pause</span> or <span class="text--weight-bold">Unpause</span> the pixel on a site.  Click the <span class="fa fa-play"></span> Action icon.  If <span class="text--weight-bold">Paused</span>, data collection from the pixel on the associated site stops until <span class="text--weight-bold">Unpaused</span>. Be sure you want to <span class="text--weight-bold">Pause</span> or <span class="text--weight-bold">Unpaused</span> the pixel! An email is sent to the admin and the user that the data collection status has changed.
            </p>
            <p class="ma-1">
                To delete a site, click the <span class="color--primary-red text--weight-bold">Trash Can</span> button under <span class="color--primary-black text--weight-bold">Actions</span>. Deleting the site from the list breaks the link to this dashboard and will make it impossible to collect new information collected from the pixel. It will freeze data collected but not yet purchased.  You will be able to purchase the collected data, but the list will no longer grow. 
            </p>
            <p class="ma-1">
                If you delete a site you can re-add it, but it will be like starting over. You will need to generate a new pixel code to install on the site.   
            </p>
            <p class="ma-1">
                To delete a pixel from a website, you will need to remove the code from the website manually.  
            </p>
            <p class="ma-1">
                If you delete the actual website, you will delete the pixel. If you delete your website it will break the link to this dashboard.  You will need to also delete the site from the dashboard to remove it from the list.
            </p>
            <h3 class="ma-1">BILLING PAGE</h3>
            <p class="ma-1">
                Data is purchased through credits.  This allows us to offset price fluctuations in the daily market and protect your ability to budget for data purchases.  At the top right of each page are the <span class="color--tertiary-blue text--weight-bold">Available Credits</span> you currently have.   Credits cost $1 each.
            </p>
            <p class="ma-1">
                To purchase credits, click the <span class="color--secondary-blue text--weight-bold">Buy Credit</span> button at the top left corner.  Manually enter the number of credits you wish to buy.  Your account may have a monthly minimum, so plan to purchase enough credits for the month.  
            </p>
            <p class="ma-1">
                The pop-up will show the number of credits you are buying and their cost in U.S. dollars.  Click <span class="color--primary text--weight-bold">Confirm</span> to progress to the payment page.
            </p>
            <p class="ma-1">
                You will be directed to pay through a Stripe payment page.  You will be prompted to pay with a credit card. Once the card has been entered, Stripe will remember it for the next time. We do not accept payments through other methods at this time.  
            </p>
            <p class="ma-1">
                The log on this page shows the dates and amounts of previous purchases with a link to the <span class="color--primary text--weight-bold">Invoice</span>.  We do not store Invoices on our servers currently, so you will need to click the Invoice link to view the Invoice and <span class="text--weight-bold">Print</span> or <span class="text--weight-bold">Print to PDF.</span> 
            </p>
            <p class="ma-1">
                Invoices are numbered in the order they are generated for all users assigned to a site.  If other users on your site(s) are authorized to purchase credits, the invoices they purchased are under their accounts. 
            </p>
            <h3 class="ma-1">USER PAGE</h3>
            <p class="ma-1">Users can be Admins or Clients.  Admins have administrative access to the site and can <span class="color--primary text--weight-bold">Add</span>, <span class="color--primary-purple text--weight-bold">Assign</span> and <span class="color--primary-green text--weight-bold">Invite</span> new users.   Admins can <span class="color--primary text--weight-bold">Edit</span>, <span class="color--primary-green text--weight-bold">Assign Credits</span>, <span class="color--primary-purple text--weight-bold">Lock, Unlock</span> or <span class="color--primary-red text--weight-bold">Delete</span> Admins and Clients under their account.  The Admin creating or inviting the new user determines their role.</p>
            <p class="ma-1">Before Adding, Assigning or Inviting a new user, be sure you are in the proper site screen – indicated by the <span class="color--primary text--weight-bold">Dropdown</span> menu on the top bar. </p>
            <p class="ma-1">Click the <span class="color--primary text--weight-bold">Add User</span> button at the top left to enter the profile and contact info for a new user.  An email will be sent to the admin and the new user.  When the new user clicks the confirmation button in the email they receive, they will be added to the User list. </p>
            <p class="ma-1">Once added to the User list, the Admin can assign a user to site with the <span class="color--primary-purple text--weight-bold">Assign User</span> button.  </p>
            <p class="ma-1"><span class="color--primary-green text--weight-bold">Invite User</span> allows an Admin to send an email to a new user so they can set up their account.  Once the new user clicks the <span class="color--primary text--weight-bold">Create Account</span> button in the email panel, they are redirected to a screen where they enter their information and password.  Once the account is initialized, their <span class="color--tertiary-blue text--weight-bold">Status</span> will change from <span class="color--primary-red text--weight-bold">Pending</span> to <span class="color--primary text--weight-bold">Active</span>.</p>
            <p class="ma-1">An Admin can <span class="color--primary text--weight-bold">Edit Profile</span>.  This allows them to change the name, email, phone number or role of the User between Admin and Client.   </p>
            <p class="ma-1">An Admin can <span class="color--primary-green text--weight-bold">Assign Credits</span> to a User.  Clicking the <span class="color--primary-green text--weight-bold">$</span> <span class="color--tertiary-blue text--weight-bold">Action</span> button allows them to see how many credits the User currently has assigned and then manually add additional credits.  </p>
            <p class="ma-1">An Admin can <span class="color--primary-purple text--weight-bold">Lock</span> or <span class="color--primary-purple text--weight-bold">Unlock</span> a user for testing and security purposes.  Clicking the Lock Action button changes the status to Lock or Unlock.  An email is sent to the admin that the status has changed.  The User is not notified. </p>
            <p class="ma-1">An Admin can delete a user with the <span class="color--primary-red text--weight-bold">Trash</span> Action button.  Once the User is deleted, they will need to be re-added and reassigned to reconnect them.</p>
       
        </div>

    </div>
</template>
<script lang="ts">
import { Settings } from "@/config";
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class Help extends Vue {
    @Prop() currentPage: string;

    get leadName() {
        return `${Settings.LeadName.charAt(0).toUpperCase()}${Settings.LeadName.slice(1)}s`;
    }
}
</script>